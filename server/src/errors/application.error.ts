export class ApplicationError extends Error {
    public readonly critical : boolean; //If the Error blocks Program-Flow (Excluding Repeating Events like Re-Voting)
    constructor(message: string, critical : boolean) {
        super(message);
        this.name = "ApplicationError";
        this.critical = critical;
    }
}
