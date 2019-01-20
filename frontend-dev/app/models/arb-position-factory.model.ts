import { ArbPosition } from './arb-position.model';
import { CurrencyPair } from './currency-pair.model';

export class ArbPositionFactory {

    public static create(data: any): ArbPosition {
        return new ArbPosition(
            data['id'],
            data['status'],
            CurrencyPair[data['currency_pair']],
            data['target_exit_profit_ratio'],
            data['target_net_profit_ratio'],
            data['target_spread'],
            data['open_bid_price'],
            data['open_bid_exchange'],
            data['open_ask_price'],
            data['open_ask_exchange'],
            data['open_amount'],
            data['open_maker_taker'],
            data['close_bid_price'],
            data['close_bid_exchange'],
            data['close_ask_price'],
            data['close_ask_exchange'],
            data['close_amount'],
            data['close_maker_taker'],
            data['estimated_open_cost'],
            data['estimated_open_commission'],
            data['estimated_close_commission'],
            data['estimated_initial_profit'],
            data['estimated_initial_profit_ratio'],
            data['estimated_open_net_profit'],
            data['estimated_open_exit_profit_ratio'],
            data['estimated_close_net_profit'],
            data['estimated_close_net_profit_ratio'],
            data['estimated_close_exit_profit_ratio'],
            data['actual_initial_profit'],
            data['actual_net_profit'],
            data['actual_net_profit_ratio'],
            data['actual_exit_profit_ratio'],
            data['bid_position'],
            data['ask_position']);
    }
}
