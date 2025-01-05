export const genTxnRef = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"

    let ref = '';

    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        ref += chars[randomIndex];
    }
    return ref;
}