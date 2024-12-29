
export enum Statuses {
    Complete = 'Order Successful!',
    Error = 'Failure Placing Order',
    Cancelled = 'Order Cancelled!'
}

export const statusesMessages = {
    Complete: {
        message: `Thank you for your purchase, `,
        paragraph: 'Your order has been confirmed. Below are the details:',
        color: "#4caf50",
    },
    Error: {
        message: `Your payment has failed`,
        paragraph: 'Kindly ensure you have enough funds in your account and try again.',
        color: "red",
    },
    Cancelled: {
        message: `You have cancelled your order.`,
        paragraph: 'Kindly make payment to receive the below item(s):',
        color: "red",
    }
}