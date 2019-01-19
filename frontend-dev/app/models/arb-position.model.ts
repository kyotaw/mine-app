import { CurrencyPair } from '../models/currency-pair.model'


export class ArbPosition {

    constructor(
        public readonly id: number,
        public readonly status: string,
        public readonly currencyPair,
        public readonly targetExitProfitRatio: number,
        public readonly targetNetProfitRratio: number,
        public readonly openBidPrice: number,
        public readonly openBidExchange: string,
        public readonly openAskPrice: number,
        public readonly openAskExchange: string,
        public readonly openAmount: number,
        public readonly openMakerTaker: string,
        public readonly closeBidPrice: string,
        public readonly closeBidExchange: string,
        public readonly closeAskPrice: string,
        public readonly closeAskExchange: string,
        public readonly closeAmount: string,
        public readonly closeMakerTaker: string,
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
        public readonly askPosition: object) {

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

        get openTimestamp() {
            if (this.isOpening) {
                return 0;
            }
            var maxTs = 0;
            for (let log of this.bidPosition['trade_logs']) {
                if (log['trade_action'] == 'OPEN_POSITION') {
                    let ts = log['timestamp']
                    if (maxTs < ts) {
                        maxTs = ts;
                    }
                }
            }
            for (let log of this.askPosition['trade_logs']) {
                if (log['trade_action'] == 'OPEN_POSITION') {
                    let ts = log['timestamp']
                    if (maxTs < ts) {
                        maxTs = ts;
                    }
                }
            }
            return maxTs;
        }

        get closeTimestamp() {
            if (!this.isClosed) {
                return 0;
            }
            var maxTs = 0;
            for (let log of this.bidPosition['trade_logs']) {
                if (log['trade_action'] == 'CLOSE_POSITION') {
                    let ts = log['timestamp']
                    if (maxTs < ts) {
                        maxTs = ts;
                    }
                }
            }
            for (let log of this.askPosition['trade_logs']) {
                if (log['trade_action'] == 'CLOSE_POSITION') {
                    let ts = log['timestamp']
                    if (maxTs < ts) {
                        maxTs = ts;
                    }
                }
            }
            return maxTs;
        }
}
