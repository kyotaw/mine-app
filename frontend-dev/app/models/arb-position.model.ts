import { CurrencyPair } from '../models/currency-pair.model'


export class ArbPosition {
    unrealizedProfit: number;
    
    constructor(
        public readonly id: number,
        public readonly status: string,
        public readonly currencyPair,
        public readonly targetExitProfitRatio: number,
        public readonly targetNetProfitRratio: number,
        public readonly targetSpread: number,
        public readonly openBidPrice: number,
        public readonly openBidExchange: string,
        public readonly openAskPrice: number,
        public readonly openAskExchange: string,
        public readonly openAmount: number,
        public readonly openMakerTakerBid: string,
        public readonly openMakerTakerAsk: string,
        public readonly openSpread: number,
        public readonly closeBidPrice: number,
        public readonly closeBidExchange: string,
        public readonly closeAskPrice: number,
        public readonly closeAskExchange: string,
        public readonly closeAmount: string,
        public readonly closeMakerTakerBid: string,
        public readonly closeMakerTakerAsk: string,
        public readonly closeSpread: number,
        public readonly estimatedOpenCost: number,
        public readonly estimatedOpenCommission: number,
        public readonly estimatedCloseCommission: number,
        public readonly estimatedInitialProfit: number,
        public readonly estimatedInitialProfitRatio: number,
        public readonly estimatedOpenNetProfit: number,
        public readonly estimatedOpenExitProfitRatio: number,
        public readonly estimatedCloseNetProfit: number,
        public readonly estimatedCloseNetProfitRatio: number,
        public readonly estimatedCloseExitProfitRatio: number,
        public readonly actualInitialProfit: number,
        public readonly actualNetProfit: number,
        public readonly actualNetProfitRatio: number,
        public readonly actualExitProfitRatio: number,
        public readonly bidPosition: object,
        public readonly askPosition: object,
        public readonly timestamp: number) {
            this.unrealizedProfit = 0;
        }

        get tradeCurrency() {
            return this.currencyPair.split('_')[0]
        }

        get settleCurrency() {
            return this.currencyPair.split('_')[1]
        }

        get isOpen() {
            return this.status == 'open';
        }
        
        get isOpening() {
            return this.status == 'opening'
        }
        
        get isPartial() {
            return this.status == 'partial'
        }
        
        get isClosing() {
            return this.status == 'closing'
        }
        
        get isClosed() {
            return this.status == 'closed'
        }

        get isBidPositionClosed() {
            return this.bidPosition['status'] == 'closed'
        }
        
        get isAskPositionClosed() {
            return this.askPosition['status'] == 'closed'
        }

        get openTimestamp() {
            if (this.isOpening) {
                return 0;
            }
            let maxTs = this.bidPosition['open_date'];
            if (maxTs < this.askPosition['open_date']) {
                maxTs = this.askPosition['open_date'];
            }
            return maxTs;
        }

        get closeTimestamp() {
            if (!this.isClosed) {
                return 0;
            }
            let maxTs = this.bidPosition['close_date'];
            if (maxTs < this.askPosition['close_date']) {
                maxTs = this.askPosition['close_date'];
            }
            return maxTs;
        }
}
