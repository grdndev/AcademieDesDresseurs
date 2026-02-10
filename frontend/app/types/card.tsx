export type card = {
    _id: string,
    images: {front: string},
    nameFR: string,
    nameEN: string,
    setNameFR: string,
    setCode: string,
    price: number,
    stock: number
}

export type cartItem = {
    _id: string;
    nameFR?: string;
    nameEN?: string;
    price: number;
    quantity: number;
    stock?: number;
    itemType: 'card' | 'deck' | 'accessory';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}