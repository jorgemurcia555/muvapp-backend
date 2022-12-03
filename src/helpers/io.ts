export const getIOConnection = () => {
    const gloobal: any = global;
    return gloobal.io;
};

export const setIOConnection = (conecction: any) => {
    const gloobal: any = global;
    gloobal.io = conecction;
};
