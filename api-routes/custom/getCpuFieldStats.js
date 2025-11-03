import handler from "../../lib/handler.js";

// Aggregation to get unique values for string fields and min-max for numeric/date fields
// This will be used as a separate endpoint or utility, not part of the main handler

// Helper function to get unique values and min-max ranges
export default async (req, res) => {

    try {

        const collection = await handler({
            body: { databaseName: "codex", collectionName: "cpus" },
        });

        const pipeline = [
            {
                $group: {
                    _id: null,
                    brands: { $addToSet: "$brand" },
                    families: { $addToSet: "$family" },
                    series: { $addToSet: "$series" },
                    sockets: { $addToSet: "$socket" },
                    codenames: { $addToSet: "$codename" },
                    segments: { $addToSet: "$segment" },

                    minCores: { $min: "$cores" },
                    maxCores: { $max: "$cores" },

                    minThreads: { $min: "$threads" },
                    maxThreads: { $max: "$threads" },

                    minTdp: { $min: "$tdp" },
                    maxTdp: { $max: "$tdp" },

                    minProcess: { $min: "$process" },
                    maxProcess: { $max: "$process" },

                    minClockMin: { $min: "$clock.min" },
                    maxClockMin: { $max: "$clock.min" },

                    minClockMax: { $min: "$clock.max" },
                    maxClockMax: { $max: "$clock.max" },

                    minRelease: { $min: "$release" },
                    maxRelease: { $max: "$release" }
                }
            },
            {
                $project: {
                    _id: 0,
                    brands: 1,
                    families: 1,
                    series: 1,
                    sockets: 1,
                    codenames: 1,
                    segments: 1,
                    cores: { min: "$minCores", max: "$maxCores" },
                    threads: { min: "$minThreads", max: "$maxThreads" },
                    tdp: { min: "$minTdp", max: "$maxTdp" },
                    process: { min: "$minProcess", max: "$maxProcess" },
                    clockMin: { min: "$minClockMin", max: "$maxClockMin" },
                    clockMax: { min: "$minClockMax", max: "$maxClockMax" },
                    release: { min: "$minRelease", max: "$maxRelease" }
                }
            }
        ];
        const stats = await collection.aggregate(pipeline).toArray();
        console.log("CPU Field Stats:", stats);
        res.send(stats[0] || {});
    } catch (error) {
        console.error("Error in getCpuFieldStats:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
