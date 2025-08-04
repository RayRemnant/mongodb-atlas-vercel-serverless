import handler from "../../lib/handler.js";

export default async (req, res) => {
    try {
        const collection = await handler({
            body: { databaseName: "codex", collectionName: "cpus" },
        });

        const aggregationPipeline = [
            // Step 1: Start with all CPU documents
            { $match: {} },

            // Step 2: Transform asins object into array format for processing
            {
                $addFields: {
                    asinEntries: {
                        $objectToArray: "$asins"
                    }
                }
            },

            // Step 3: Unwind the TLD entries
            { $unwind: "$asinEntries" },

            // Step 4: Unwind the ASIN arrays within each TLD
            { $unwind: "$asinEntries.v" },

            // Step 5: Lookup most recent price data from amazon collection
            {
                $lookup: {
                    from: "amazon",
                    let: {
                        asinValue: "$asinEntries.v",
                        tldValue: "$asinEntries.k"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$asin", "$$asinValue"] }
                            }
                        },
                        { $addFields: { timestamp: { $toDate: "$_id" } } },
                        { $sort: { tld: 1, timestamp: -1 } },
                        {
                            $group: {
                                _id: "$tld",
                                doc: { $first: "$$ROOT" }
                            }
                        },
                        { $replaceRoot: { newRoot: "$doc" } },
                        // Filter by TLD if it matches
                        {
                            $match: {
                                $expr: { $eq: ["$tld", "$$tldValue"] }
                            }
                        }
                    ],
                    as: "priceInfo"
                }
            },

            // Step 6: Create the price data object
            {
                $addFields: {
                    priceDataEntry: {
                        tld: "$asinEntries.k",
                        source: "amazon",
                        asin: "$asinEntries.v",
                        price: {
                            $ifNull: [
                                { $arrayElemAt: ["$priceInfo.price", 0] },
                                null
                            ]
                        },
                        currency: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$asinEntries.k", "com"] }, then: "USD" },
                                    { case: { $in: ["$asinEntries.k", ["it", "fr", "de", "es", "nl", "be", "at", "pt", "ie", "fi", "gr", "lu", "si", "sk", "ee", "lv", "lt", "cy", "mt"]] }, then: "EUR" }
                                ],
                                default: "USD"
                            }
                        },
                        lastUpdated: {
                            $ifNull: [
                                { $arrayElemAt: ["$priceInfo.createdAt", 0] },
                                null
                            ]
                        },
                        available: {
                            $ifNull: [
                                { $ne: [{ $arrayElemAt: ["$priceInfo.price", 0] }, null] },
                                false
                            ]
                        }
                    }
                }
            },

            // Step 7: Group back by CPU document to collect all price data
            {
                $group: {
                    _id: "$_id",
                    cpuDoc: { $first: "$$ROOT" },
                    priceDataArray: { $push: "$priceDataEntry" }
                }
            },

            // Step 8: Add the priceData array to the CPU document
            {
                $addFields: {
                    "cpuDoc.priceData": "$priceDataArray"
                }
            },

            // Step 9: Replace root with the updated CPU document
            { $replaceRoot: { newRoot: "$cpuDoc" } },

            // Step 10: Add sort key to each price entry and then sort
            {
                $addFields: {
                    priceData: {
                        $map: {
                            input: "$priceData",
                            as: "item",
                            in: {
                                $mergeObjects: [
                                    "$$item",
                                    {
                                        sortKey: {
                                            $cond: [
                                                // if price is null, assign a high value for sorting, so it appears last
                                                { $eq: ["$$item.price", null] },
                                                999999,
                                                "$$item.price"
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            
            // Step 11: Sort the priceData array by sortKey in ascending order
            {
                $addFields: {
                    priceData: {
                        $sortArray: {
                            input: "$priceData",
                            sortBy: { sortKey: 1 }
                        }
                    }
                }
            },
            
            // Step 12: Remove the temporary sortKey field
            {
                $addFields: {
                    priceData: {
                        $map: {
                            input: "$priceData",
                            as: "item",
                            in: {
                                $unsetField: {
                                    field: "sortKey",
                                    input: "$$item"
                                }
                            }
                        }
                    }
                }
            },

            // Step 13: Clean up temporary fields
            {
                $project: {
                    asinEntries: 0,
                    priceInfo: 0,
                    priceDataEntry: 0,
                    asins: 0
                }
            }
        ];

        const result = await collection.aggregate(aggregationPipeline).toArray();

        res.send(result);
    } catch (error) {
        console.error("Error fetching CPU data with prices:", error);
        res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
};