export interface Arg {
    type: string,
    name: string,
    value: string
}

export interface Activity {
    id: string,
    type: string,
    action: string,
    to: string,
    from: string,
    createdAt: Date,
    args: Arg[]
}
