export class TicketPurchasedEvent {
  constructor(
    public readonly userEmail: string,
    public readonly tickets: any[],
  ) {}
}
