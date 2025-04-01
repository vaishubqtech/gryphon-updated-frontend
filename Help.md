# Gryphon Finance API Usage Documentation

## Internal Market Operations

1. For internal market buying and selling, call the `Bonding` contract's `sell` and `buy` methods.
2. To launch a new internal token, call the `launch` method.
3. To estimate exchange rates, call the `FRouter` contract's `getAmountsOut` method.

## External Market Operations

1. For external market buying and selling, use PancakeSwap V3 with a fixed fee of 2500.
2. To estimate exchange ratios, call the `IQuoterV2` interface methods.
3. For executing exchanges, use the `ISwapRouter` contract methods.

# contracts address

| Contract Name | Address                                    | Network     |
|---------------|--------------------------------------------|-------------|
| Bonding       | 0x66cdd203413970855a5AEe51a7ADD4519F27aC35 | BSC Test    |
| FRouter       | 0xdd0F4Ec5A1fa8949506208c54D3232643e12A67b | BSC    Test |
| FFactory      | 0xc5fd4915762c796616C684f7D8B7c12365956b71 | BSC Test    |
| AgentFactory  | 0xF430c5DFbcbAe45d850440C36B388b2e747f1266 | BSC Test    |
| ISwapRouter   | 0x1b81D678ffb9C0263b24A97847620C99d213eB14 | BSC Test    |
| IQuoterV2     | 0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2 | BSC Test    |