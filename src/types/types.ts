export interface Market {
  question: string;
  // The main question being asked in the prediction market.
  // Example: "Will Bitcoin hit $100k by December?"

  optionA: string;
  // The first possible outcome users can bet on.
  // Example: "Yes"

  optionB: string;
  // The second possible outcome users can bet on.
  // Example: "No"

  endTime: string;
  // The time when the market closes.
  // Stored as a string (usually an ISO date format).

  outcome: string;
  // The final result of the market.
  // Set only after the market is resolved.

  totalOptionAShares: number;
  // Total number of shares placed on option A.
  // Indicates how much belief is on this outcome.

  totalOptionBShares: number;
  // Total number of shares placed on option B.
  // Indicates how much belief is on this outcome.

  resolved: boolean;
  // Indicates whether the market has been finalized.
  // TRUE = outcome decided, FALSE = still active.
}
