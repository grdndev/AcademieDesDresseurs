export const formatPrice = (val: any) => {
    val = parseFloat(val).toFixed(2).toString();
    val = val.includes(".") ? val : val + "."
    const [a,b] = val.split(".");
    return a + "." + b.padEnd(2,"0");
}