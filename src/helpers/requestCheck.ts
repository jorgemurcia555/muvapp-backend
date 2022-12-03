export const checkParams = (type: string, target: any, source: any, config: any)  => {
    if (type === "date") {
        if (source.hasOwnProperty(config.left) && !source.hasOwnProperty(config.right)) {
            target[config.field] = { $gte: new Date(source[config.left]).toISOString() };
        }
        if (source.hasOwnProperty(config.left) && source.hasOwnProperty(config.right)) {
            target[config.field] = { $gte: new Date(source[config.left]).toISOString(), $lte: new Date(source[config.right]).toISOString() };
        }
        if (!source.hasOwnProperty(config.left) && source.hasOwnProperty(config.right)) {
            target[config.field] = { $lte: new Date(source[config.right]).toISOString() };
        }
        // delete params[""]
    } else if (type === "number") {
        config.forEach((key: any) => {
            if (source.hasOwnProperty(key)) {
                target[key] = Number(source[key]);
            }
        });
    } else if (type === "match") {
        config.forEach((field: any) => {
            if (source.hasOwnProperty(field)) {
                target[field] = {"$regex" : source[field], "$options" : "i" };
            }
        });
    } else if (type === "bool") {
        config.forEach((key: any) => {
            if (source.hasOwnProperty(key)) {
                target[key] = Boolean(source[key]);
            }
        });
    }
};
