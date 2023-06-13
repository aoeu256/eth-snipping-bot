// includes common functions
import { ethers } from 'ethers'

import { eth_address, uniswap_v2_factory } from '../constants/constants.js';
import erc20Abi from '../constants/abi/erc20.json' assert { type: "json" };
import uniswapV2FactoryAbi from '../constants/abi/uniswapV2Factory.json' assert { type: "json" };

export function get_provider () {
    return new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
}

export async function get_eth_balance (address, provider) {
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);   // return eth balance
}

export function get_contract (address, abi, provider) {
    return new ethers.Contract(address, abi, provider);
}

export function get_token_contract (address, provider) {
    return get_contract(address, erc20Abi, provider);
}

export function get_uniswap_factory () {
    return new ethers.Contract(uniswap_v2_factory, uniswapV2FactoryAbi, get_provider());
}

export async function get_pair_address (address) {
    const factory = get_uniswap_factory();
    const res = await factory.getPair(address, eth_address);
    return res;
}

export async function get_token_info (address, provider) {
    const contract = get_token_contract(address, provider);
    const name = await contract.name();
    const symbol = await contract.symbol();
    const decimals = await contract.decimals();
    let total_supply = await contract.totalSupply();
    total_supply = ethers.utils.formatUnits(total_supply, decimals);
    const res = {
        'name': name,
        'symbol': symbol,
        'decimal': decimals,
        'total_supply': total_supply
    }
    return res;
}