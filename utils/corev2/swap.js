import {Buffer} from 'buffer';
import {struct, u8, blob} from '@solana/buffer-layout';
import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {u64, publicKey} from '@solana/buffer-layout-utils';
import {loadAccount} from './util/account.js';

export const TOKEN_SWAP_PROGRAM_ID = new PublicKey(
  'SwapsVeCiPHMUAtzQWZw7RjsKjgCjhwU55QGu4U1Szw',
);

export const OLD_TOKEN_SWAP_PROGRAM_ID = new PublicKey(
  'SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8',
);



export const TokenSwapLayout = struct([
  u8('version'),
  u8('isInitialized'),
  u8('bumpSeed'),
  publicKey('poolTokenProgramId'),
  publicKey('tokenAccountA'),
  publicKey('tokenAccountB'),
  publicKey('tokenPool'),
  publicKey('mintA'),
  publicKey('mintB'),
  publicKey('feeAccount'),
  u64('tradeFeeNumerator'),
  u64('tradeFeeDenominator'),
  u64('ownerTradeFeeNumerator'),
  u64('ownerTradeFeeDenominator'),
  u64('ownerWithdrawFeeNumerator'),
  u64('ownerWithdrawFeeDenominator'),
  u64('hostFeeNumerator'),
  u64('hostFeeDenominator'),
  u8('curveType'),
  blob(32, 'curveParameters'),
]);

export const CurveType = Object.freeze({
  ConstantProduct: 0, // Constant product curve, Uniswap-style
  ConstantPrice: 1, // Constant price curve, always X amount of A token for 1 B token, where X is defined at init
  Offset: 2, // Offset curve, like Uniswap, but with an additional offset on the token B side
});

/**
 * A program to exchange tokens against a pool of liquidity
 */
export class TokenSwap {
  /**
   * Create a Token object attached to the specific token
   *
   * @param connection The connection to use
   * @param tokenSwap The token swap account
   * @param swapProgramId The program ID of the token-swap program
   * @param poolTokenProgramId The program ID of the token program for the pool tokens
   * @param poolToken The pool token
   * @param authority The authority over the swap and accounts
   * @param tokenAccountA The token swap's Token A account
   * @param tokenAccountB The token swap's Token B account
   * @param mintA The mint of Token A
   * @param mintB The mint of Token B
   * @param tradeFeeNumerator The trade fee numerator
   * @param tradeFeeDenominator The trade fee denominator
   * @param ownerTradeFeeNumerator The owner trade fee numerator
   * @param ownerTradeFeeDenominator The owner trade fee denominator
   * @param ownerWithdrawFeeNumerator The owner withdraw fee numerator
   * @param ownerWithdrawFeeDenominator The owner withdraw fee denominator
   * @param hostFeeNumerator The host fee numerator
   * @param hostFeeDenominator The host fee denominator
   * @param curveType The curve type
   * @param payer Pays for the transaction
   */
  constructor(
    connection,
    tokenSwap,
    swapProgramId,
    poolTokenProgramId,
    poolToken,
    feeAccount,
    authority,
    tokenAccountA,
    tokenAccountB,
    mintA,
    mintB,
    tradeFeeNumerator,
    tradeFeeDenominator,
    ownerTradeFeeNumerator,
    ownerTradeFeeDenominator,
    ownerWithdrawFeeNumerator,
    ownerWithdrawFeeDenominator,
    hostFeeNumerator,
    hostFeeDenominator,
    curveType,
    payer,
  ) {
    this.connection = connection;
    this.tokenSwap = tokenSwap;
    this.swapProgramId = swapProgramId;
    this.poolTokenProgramId = poolTokenProgramId;
    this.poolToken = poolToken;
    this.feeAccount = feeAccount;
    this.authority = authority;
    this.tokenAccountA = tokenAccountA;
    this.tokenAccountB = tokenAccountB;
    this.mintA = mintA;
    this.mintB = mintB;
    this.tradeFeeNumerator = tradeFeeNumerator;
    this.tradeFeeDenominator = tradeFeeDenominator;
    this.ownerTradeFeeNumerator = ownerTradeFeeNumerator;
    this.ownerTradeFeeDenominator = ownerTradeFeeDenominator;
    this.ownerWithdrawFeeNumerator = ownerWithdrawFeeNumerator;
    this.ownerWithdrawFeeDenominator = ownerWithdrawFeeDenominator;
    this.hostFeeNumerator = hostFeeNumerator;
    this.hostFeeDenominator = hostFeeDenominator;
    this.curveType = curveType;
    this.payer = payer;
  }

  /**
   * Get the minimum balance for the token swap account to be rent exempt
   *
   * @return Number of lamports required
   */
  static async getMinBalanceRentForExemptTokenSwap(
    connection,
  ) {
    return await connection.getMinimumBalanceForRentExemption(
      TokenSwapLayout.span,
    );
  }

  static createInitSwapInstruction(
    tokenSwapAccount,
    authority,
    tokenAccountA,
    tokenAccountB,
    tokenPool,
    feeAccount,
    tokenAccountPool,
    poolTokenProgramId,
    swapProgramId,
    tradeFeeNumerator,
    tradeFeeDenominator,
    ownerTradeFeeNumerator,
    ownerTradeFeeDenominator,
    ownerWithdrawFeeNumerator,
    ownerWithdrawFeeDenominator,
    hostFeeNumerator,
    hostFeeDenominator,
    curveType,
    curveParameters = new Uint8Array(),
  ) {
    const keys = [
      {pubkey: tokenSwapAccount.publicKey, isSigner: false, isWritable: true},
      {pubkey: authority, isSigner: false, isWritable: false},
      {pubkey: tokenAccountA, isSigner: false, isWritable: false},
      {pubkey: tokenAccountB, isSigner: false, isWritable: false},
      {pubkey: tokenPool, isSigner: false, isWritable: true},
      {pubkey: feeAccount, isSigner: false, isWritable: false},
      {pubkey: tokenAccountPool, isSigner: false, isWritable: true},
      {pubkey: poolTokenProgramId, isSigner: false, isWritable: false},
    ];
    const commandDataLayout = struct<CreateInstruction>([
      u8('instruction'),
      u64('tradeFeeNumerator'),
      u64('tradeFeeDenominator'),
      u64('ownerTradeFeeNumerator'),
      u64('ownerTradeFeeDenominator'),
      u64('ownerWithdrawFeeNumerator'),
      u64('ownerWithdrawFeeDenominator'),
      u64('hostFeeNumerator'),
      u64('hostFeeDenominator'),
      u8('curveType'),
      blob(32, 'curveParameters'),
    ]);
    let data = Buffer.alloc(1024);

    // package curve parameters
    // NOTE: currently assume all curves take a single parameter, u64 int
    //       the remaining 24 of the 32 bytes available are filled with 0s
    const curveParamsBuffer = Buffer.alloc(32);
    Buffer.from(curveParameters).copy(curveParamsBuffer);

    {
      const encodeLength = commandDataLayout.encode(
        {
          instruction: 0, // InitializeSwap instruction
          tradeFeeNumerator,
          tradeFeeDenominator,
          ownerTradeFeeNumerator,
          ownerTradeFeeDenominator,
          ownerWithdrawFeeNumerator,
          ownerWithdrawFeeDenominator,
          hostFeeNumerator,
          hostFeeDenominator,
          curveType,
          curveParameters: curveParamsBuffer,
        },
        data,
      );
      data = data.slice(0, encodeLength);
    }
    return new TransactionInstruction({
      keys,
      programId: swapProgramId,
      data,
    });
  }

  static async loadTokenSwap(
    connection,
    address,
    programId,
    payer,
  ) {
    const data = await loadAccount(connection, address, programId);
    const tokenSwapData = TokenSwapLayout.decode(data);
    if (!tokenSwapData.isInitialized) {
      throw new Error(`Invalid token swap state`);
    }

    const [authority] = await PublicKey.findProgramAddress(
      [address.toBuffer()],
      programId,
    );

    const poolToken = new PublicKey(tokenSwapData.tokenPool);
    const feeAccount = new PublicKey(tokenSwapData.feeAccount);
    const tokenAccountA = new PublicKey(tokenSwapData.tokenAccountA);
    const tokenAccountB = new PublicKey(tokenSwapData.tokenAccountB);
    const mintA = new PublicKey(tokenSwapData.mintA);
    const mintB = new PublicKey(tokenSwapData.mintB);
    const poolTokenProgramId = new PublicKey(tokenSwapData.poolTokenProgramId);
    const curveType = tokenSwapData.curveType;

    return new TokenSwap(
      connection,
      address,
      programId,
      poolTokenProgramId,
      poolToken,
      feeAccount,
      authority,
      tokenAccountA,
      tokenAccountB,
      mintA,
      mintB,
      tokenSwapData.tradeFeeNumerator,
      tokenSwapData.tradeFeeDenominator,
      tokenSwapData.ownerTradeFeeNumerator,
      tokenSwapData.ownerTradeFeeDenominator,
      tokenSwapData.ownerWithdrawFeeNumerator,
      tokenSwapData.ownerWithdrawFeeDenominator,
      tokenSwapData.hostFeeNumerator,
      tokenSwapData.hostFeeDenominator,
      curveType,
      payer,
    );
  }

  /**
   * Create a new Token Swap
   *
   * @param connection The connection to use
   * @param payer Pays for the transaction
   * @param tokenSwapAccount The token swap account
   * @param authority The authority over the swap and accounts
   * @param tokenAccountA: The token swap's Token A account
   * @param tokenAccountB: The token swap's Token B account
   * @param poolToken The pool token
   * @param tokenAccountPool The token swap's pool token account
   * @param poolTokenProgramId The program ID of the token program for pool tokens
   * @param swapProgramId The program ID of the token-swap program
   * @param feeNumerator Numerator of the fee ratio
   * @param feeDenominator Denominator of the fee ratio
   * @return Token object for the newly minted token, Public key of the account holding the total supply of new tokens
   */
  static async createTokenSwap(
    connection,
    payer,
    tokenSwapAccount,
    authority,
    tokenAccountA,
    tokenAccountB,
    poolToken,
    mintA,
    mintB,
    feeAccount,
    tokenAccountPool,
    swapProgramId,
    poolTokenProgramId,
    tradeFeeNumerator,
    tradeFeeDenominator,
    ownerTradeFeeNumerator,
    ownerTradeFeeDenominator,
    ownerWithdrawFeeNumerator,
    ownerWithdrawFeeDenominator,
    hostFeeNumerator,
    hostFeeDenominator,
    curveType,
    curveParameters,
    confirmOptions,
  ) {
    const tokenSwap = new TokenSwap(
      connection,
      tokenSwapAccount.publicKey,
      swapProgramId,
      poolTokenProgramId,
      poolToken,
      feeAccount,
      authority,
      tokenAccountA,
      tokenAccountB,
      mintA,
      mintB,
      tradeFeeNumerator,
      tradeFeeDenominator,
      ownerTradeFeeNumerator,
      ownerTradeFeeDenominator,
      ownerWithdrawFeeNumerator,
      ownerWithdrawFeeDenominator,
      hostFeeNumerator,
      hostFeeDenominator,
      curveType,
      payer,
    );

    // Allocate memory for the account
    const balanceNeeded =
      await TokenSwap.getMinBalanceRentForExemptTokenSwap(connection);
    const transaction = new Transaction();
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: tokenSwapAccount.publicKey,
        lamports: balanceNeeded,
        space: TokenSwapLayout.span,
        programId: swapProgramId,
      }),
    );

    const instruction = TokenSwap.createInitSwapInstruction(
      tokenSwapAccount,
      authority,
      tokenAccountA,
      tokenAccountB,
      poolToken,
      feeAccount,
      tokenAccountPool,
      poolTokenProgramId,
      swapProgramId,
      tradeFeeNumerator,
      tradeFeeDenominator,
      ownerTradeFeeNumerator,
      ownerTradeFeeDenominator,
      ownerWithdrawFeeNumerator,
      ownerWithdrawFeeDenominator,
      hostFeeNumerator,
      hostFeeDenominator,
      curveType,
      curveParameters,
    );

    transaction.add(instruction);
    await sendAndConfirmTransaction(
      connection,
      transaction,
      [payer, tokenSwapAccount],
      confirmOptions,
    );

    return tokenSwap;
  }

  /**
   * Swap token A for token B
   *
   * @param userSource User's source token account
   * @param poolSource Pool's source token account
   * @param poolDestination Pool's destination token account
   * @param userDestination User's destination token account
   * @param sourceMint Mint for the source token
   * @param destinationMint Mint for the destination token
   * @param sourceTokenProgramId Program id for the source token
   * @param destinationTokenProgramId Program id for the destination token
   * @param hostFeeAccount Host account to gather fees
   * @param userTransferAuthority Account delegated to transfer user's tokens
   * @param amountIn Amount to transfer from source account
   * @param minimumAmountOut Minimum amount of tokens the user will receive
   */
  async swap(
    userSource,
    poolSource,
    poolDestination,
    userDestination,
    sourceMint,
    destinationMint,
    sourceTokenProgramId,
    destinationTokenProgramId,
    hostFeeAccount,
    userTransferAuthority,
    amountIn,
    minimumAmountOut,
    confirmOptions,
  ) {
    return await sendAndConfirmTransaction(
      this.connection,
      new Transaction().add(
        TokenSwap.swapInstruction(
          this.tokenSwap,
          this.authority,
          userTransferAuthority.publicKey,
          userSource,
          poolSource,
          poolDestination,
          userDestination,
          this.poolToken,
          this.feeAccount,
          hostFeeAccount,
          sourceMint,
          destinationMint,
          this.swapProgramId,
          sourceTokenProgramId,
          destinationTokenProgramId,
          this.poolTokenProgramId,
          amountIn,
          minimumAmountOut,
        ),
      ),
      [this.payer, userTransferAuthority],
      confirmOptions,
    );
  }

  static swapInstruction(
    tokenSwap,
    authority,
    userTransferAuthority,
    userSource,
    poolSource,
    poolDestination,
    userDestination,
    poolMint,
    feeAccount,
    hostFeeAccount,
    sourceMint,
    destinationMint,
    swapProgramId,
    sourceTokenProgramId,
    destinationTokenProgramId,
    poolTokenProgramId,
    amountIn,
    minimumAmountOut,
  ) {
    const dataLayout = struct<SwapInstruction>([
      u8('instruction'),
      u64('amountIn'),
      u64('minimumAmountOut'),
    ]);

    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode(
      {
        instruction: 1, // Swap instruction
        amountIn,
        minimumAmountOut,
      },
      data,
    );

    const keys = [
      {pubkey: tokenSwap, isSigner: false, isWritable: false},
      {pubkey: authority, isSigner: false, isWritable: false},
      {pubkey: userTransferAuthority, isSigner: true, isWritable: false},
      {pubkey: userSource, isSigner: false, isWritable: true},
      {pubkey: poolSource, isSigner: false, isWritable: true},
      {pubkey: poolDestination, isSigner: false, isWritable: true},
      {pubkey: userDestination, isSigner: false, isWritable: true},
      {pubkey: poolMint, isSigner: false, isWritable: true},
      {pubkey: feeAccount, isSigner: false, isWritable: true},
      {pubkey: sourceMint, isSigner: false, isWritable: false},
      {pubkey: destinationMint, isSigner: false, isWritable: false},
      {pubkey: sourceTokenProgramId, isSigner: false, isWritable: false},
      {pubkey: destinationTokenProgramId, isSigner: false, isWritable: false},
      {pubkey: poolTokenProgramId, isSigner: false, isWritable: false},
    ];
    if (hostFeeAccount !== null) {
      keys.push({pubkey: hostFeeAccount, isSigner: false, isWritable: true});
    }
    return new TransactionInstruction({
      keys,
      programId: swapProgramId,
      data,
    });
  }

  /**
   * Deposit tokens into the pool
   * @param userAccountA User account for token A
   * @param userAccountB User account for token B
   * @param poolAccount User account for pool token
   * @param tokenProgramIdA Program id for token A
   * @param tokenProgramIdB Program id for token B
   * @param userTransferAuthority Account delegated to transfer user's tokens
   * @param poolTokenAmount Amount of pool tokens to mint
   * @param maximumTokenA The maximum amount of token A to deposit
   * @param maximumTokenB The maximum amount of token B to deposit
   */
  async depositAllTokenTypes(
    userAccountA,
    userAccountB,
    poolAccount,
    tokenProgramIdA,
    tokenProgramIdB,
    userTransferAuthority,
    poolTokenAmount,
    maximumTokenA,
    maximumTokenB,
    confirmOptions,
  ) {
    return await sendAndConfirmTransaction(
      this.connection,
      new Transaction().add(
        TokenSwap.depositAllTokenTypesInstruction(
          this.tokenSwap,
          this.authority,
          userTransferAuthority.publicKey,
          userAccountA,
          userAccountB,
          this.tokenAccountA,
          this.tokenAccountB,
          this.poolToken,
          poolAccount,
          this.mintA,
          this.mintB,
          this.swapProgramId,
          tokenProgramIdA,
          tokenProgramIdB,
          this.poolTokenProgramId,
          poolTokenAmount,
          maximumTokenA,
          maximumTokenB,
        ),
      ),
      [this.payer, userTransferAuthority],
      confirmOptions,
    );
  }

  static depositAllTokenTypesInstruction(
    tokenSwap,
    authority,
    userTransferAuthority,
    sourceA,
    sourceB,
    intoA,
    intoB,
    poolToken,
    poolAccount,
    mintA,
    mintB,
    swapProgramId,
    tokenProgramIdA,
    tokenProgramIdB,
    poolTokenProgramId,
    poolTokenAmount,
    maximumTokenA,
    maximumTokenB,
  ) {
    const dataLayout = struct<DepositAllInstruction>([
      u8('instruction'),
      u64('poolTokenAmount'),
      u64('maximumTokenA'),
      u64('maximumTokenB'),
    ]);

    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode(
      {
        instruction: 2, // Deposit instruction
        poolTokenAmount,
        maximumTokenA,
        maximumTokenB,
      },
      data,
    );

    const keys = [
      {pubkey: tokenSwap, isSigner: false, isWritable: false},
      {pubkey: authority, isSigner: false, isWritable: false},
      {pubkey: userTransferAuthority, isSigner: true, isWritable: false},
      {pubkey: sourceA, isSigner: false, isWritable: true},
      {pubkey: sourceB, isSigner: false, isWritable: true},
      {pubkey: intoA, isSigner: false, isWritable: true},
      {pubkey: intoB, isSigner: false, isWritable: true},
      {pubkey: poolToken, isSigner: false, isWritable: true},
      {pubkey: poolAccount, isSigner: false, isWritable: true},
      {pubkey: mintA, isSigner: false, isWritable: false},
      {pubkey: mintB, isSigner: false, isWritable: false},
      {pubkey: tokenProgramIdA, isSigner: false, isWritable: false},
      {pubkey: tokenProgramIdB, isSigner: false, isWritable: false},
      {pubkey: poolTokenProgramId, isSigner: false, isWritable: false},
    ];
    return new TransactionInstruction({
      keys,
      programId: swapProgramId,
      data,
    });
  }

  /**
   * Withdraw tokens from the pool
   *
   * @param userAccountA User account for token A
   * @param userAccountB User account for token B
   * @param poolAccount User account for pool token
   * @param tokenProgramIdA Program id for token A
   * @param tokenProgramIdB Program id for token B
   * @param userTransferAuthority Account delegated to transfer user's tokens
   * @param poolTokenAmount Amount of pool tokens to burn
   * @param minimumTokenA The minimum amount of token A to withdraw
   * @param minimumTokenB The minimum amount of token B to withdraw
   */
  async withdrawAllTokenTypes(
    userAccountA,
    userAccountB,
    poolAccount,
    tokenProgramIdA,
    tokenProgramIdB,
    userTransferAuthority,
    poolTokenAmount,
    minimumTokenA,
    minimumTokenB,
    confirmOptions,
  ) {
    return await sendAndConfirmTransaction(
      this.connection,
      new Transaction().add(
        TokenSwap.withdrawAllTokenTypesInstruction(
          this.tokenSwap,
          this.authority,
          userTransferAuthority.publicKey,
          this.poolToken,
          this.feeAccount,
          poolAccount,
          this.tokenAccountA,
          this.tokenAccountB,
          userAccountA,
          userAccountB,
          this.mintA,
          this.mintB,
          this.swapProgramId,
          this.poolTokenProgramId,
          tokenProgramIdA,
          tokenProgramIdB,
          poolTokenAmount,
          minimumTokenA,
          minimumTokenB,
        ),
      ),
      [this.payer, userTransferAuthority],
      confirmOptions,
    );
  }

  static withdrawAllTokenTypesInstruction(
    tokenSwap,
    authority,
    userTransferAuthority,
    poolMint,
    feeAccount,
    sourcePoolAccount,
    fromA,
    fromB,
    userAccountA,
    userAccountB,
    mintA,
    mintB,
    swapProgramId,
    poolTokenProgramId,
    tokenProgramIdA,
    tokenProgramIdB,
    poolTokenAmount,
    minimumTokenA,
    minimumTokenB,
  ) {
    const dataLayout = struct<WithdrawAllInstruction>([
      u8('instruction'),
      u64('poolTokenAmount'),
      u64('minimumTokenA'),
      u64('minimumTokenB'),
    ]);

    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode(
      {
        instruction: 3, // Withdraw instruction
        poolTokenAmount,
        minimumTokenA,
        minimumTokenB,
      },
      data,
    );

    const keys = [
      {pubkey: tokenSwap, isSigner: false, isWritable: false},
      {pubkey: authority, isSigner: false, isWritable: false},
      {pubkey: userTransferAuthority, isSigner: true, isWritable: false},
      {pubkey: poolMint, isSigner: false, isWritable: true},
      {pubkey: sourcePoolAccount, isSigner: false, isWritable: true},
      {pubkey: fromA, isSigner: false, isWritable: true},
      {pubkey: fromB, isSigner: false, isWritable: true},
      {pubkey: userAccountA, isSigner: false, isWritable: true},
      {pubkey: userAccountB, isSigner: false, isWritable: true},
      {pubkey: feeAccount, isSigner: false, isWritable: true},
      {pubkey: mintA, isSigner: false, isWritable: false},
      {pubkey: mintB, isSigner: false, isWritable: false},
      {pubkey: poolTokenProgramId, isSigner: false, isWritable: false},
      {pubkey: tokenProgramIdA, isSigner: false, isWritable: false},
      {pubkey: tokenProgramIdB, isSigner: false, isWritable: false},
    ];
    return new TransactionInstruction({
      keys,
      programId: swapProgramId,
      data,
    });
  }

  /**
   * Deposit one side of tokens into the pool
   * @param userAccount User account to deposit token A or B
   * @param poolAccount User account to receive pool tokens
   * @param sourceMint Mint for the source token
   * @param sourceTokenProgramId Program id for the source token
   * @param userTransferAuthority Account delegated to transfer user's tokens
   * @param sourceTokenAmount The amount of token A or B to deposit
   * @param minimumPoolTokenAmount Minimum amount of pool tokens to mint
   */
  async depositSingleTokenTypeExactAmountIn(
    userAccount,
    poolAccount,
    sourceMint,
    sourceTokenProgramId,
    userTransferAuthority,
    sourceTokenAmount,
    minimumPoolTokenAmount,
    confirmOptions,
  ) {
    return await sendAndConfirmTransaction(
      this.connection,
      new Transaction().add(
        TokenSwap.depositSingleTokenTypeExactAmountInInstruction(
          this.tokenSwap,
          this.authority,
          userTransferAuthority.publicKey,
          userAccount,
          this.tokenAccountA,
          this.tokenAccountB,
          this.poolToken,
          poolAccount,
          sourceMint,
          this.swapProgramId,
          sourceTokenProgramId,
          this.poolTokenProgramId,
          sourceTokenAmount,
          minimumPoolTokenAmount,
        ),
      ),
      [this.payer, userTransferAuthority],
      confirmOptions,
    );
  }

  static depositSingleTokenTypeExactAmountInInstruction(
    tokenSwap,
    authority,
    userTransferAuthority,
    source,
    intoA,
    intoB,
    poolToken,
    poolAccount,
    sourceMint,
    swapProgramId,
    sourceTokenProgramId,
    poolTokenProgramId,
    sourceTokenAmount,
    minimumPoolTokenAmount,
  ) {
    const dataLayout = struct<DepositSingleTokenTypeInstruction>([
      u8('instruction'),
      u64('sourceTokenAmount'),
      u64('minimumPoolTokenAmount'),
    ]);

    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode(
      {
        instruction: 4, // depositSingleTokenTypeExactAmountIn instruction
        sourceTokenAmount,
        minimumPoolTokenAmount,
      },
      data,
    );

    const keys = [
      {pubkey: tokenSwap, isSigner: false, isWritable: false},
      {pubkey: authority, isSigner: false, isWritable: false},
      {pubkey: userTransferAuthority, isSigner: true, isWritable: false},
      {pubkey: source, isSigner: false, isWritable: true},
      {pubkey: intoA, isSigner: false, isWritable: true},
      {pubkey: intoB, isSigner: false, isWritable: true},
      {pubkey: poolToken, isSigner: false, isWritable: true},
      {pubkey: poolAccount, isSigner: false, isWritable: true},
      {pubkey: sourceMint, isSigner: false, isWritable: false},
      {pubkey: sourceTokenProgramId, isSigner: false, isWritable: false},
      {pubkey: poolTokenProgramId, isSigner: false, isWritable: false},
    ];
    return new TransactionInstruction({
      keys,
      programId: swapProgramId,
      data,
    });
  }

  /**
   * Withdraw tokens from the pool
   *
   * @param userAccount User account to receive token A or B
   * @param poolAccount User account to burn pool token
   * @param destinationMint Mint for the destination token
   * @param destinationTokenProgramId Program id for the destination token
   * @param userTransferAuthority Account delegated to transfer user's tokens
   * @param destinationTokenAmount The amount of token A or B to withdraw
   * @param maximumPoolTokenAmount Maximum amount of pool tokens to burn
   */
  async withdrawSingleTokenTypeExactAmountOut(
    userAccount,
    poolAccount,
    destinationMint,
    destinationTokenProgramId,
    userTransferAuthority,
    destinationTokenAmount,
    maximumPoolTokenAmount,
    confirmOptions,
  ) {
    return await sendAndConfirmTransaction(
      this.connection,
      new Transaction().add(
        TokenSwap.withdrawSingleTokenTypeExactAmountOutInstruction(
          this.tokenSwap,
          this.authority,
          userTransferAuthority.publicKey,
          this.poolToken,
          this.feeAccount,
          poolAccount,
          this.tokenAccountA,
          this.tokenAccountB,
          userAccount,
          destinationMint,
          this.swapProgramId,
          this.poolTokenProgramId,
          destinationTokenProgramId,
          destinationTokenAmount,
          maximumPoolTokenAmount,
        ),
      ),
      [this.payer, userTransferAuthority],
      confirmOptions,
    );
  }

  static withdrawSingleTokenTypeExactAmountOutInstruction(
    tokenSwap,
    authority,
    userTransferAuthority,
    poolMint,
    feeAccount,
    sourcePoolAccount,
    fromA,
    fromB,
    userAccount,
    destinationMint,
    swapProgramId,
    poolTokenProgramId,
    destinationTokenProgramId,
    destinationTokenAmount,
    maximumPoolTokenAmount,
  ) {
    const dataLayout = struct<WithdrawSingleTokenTypeInstruction>([
      u8('instruction'),
      u64('destinationTokenAmount'),
      u64('maximumPoolTokenAmount'),
    ]);

    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode(
      {
        instruction: 5, // withdrawSingleTokenTypeExactAmountOut instruction
        destinationTokenAmount,
        maximumPoolTokenAmount,
      },
      data,
    );

    const keys = [
      {pubkey: tokenSwap, isSigner: false, isWritable: false},
      {pubkey: authority, isSigner: false, isWritable: false},
      {pubkey: userTransferAuthority, isSigner: true, isWritable: false},
      {pubkey: poolMint, isSigner: false, isWritable: true},
      {pubkey: sourcePoolAccount, isSigner: false, isWritable: true},
      {pubkey: fromA, isSigner: false, isWritable: true},
      {pubkey: fromB, isSigner: false, isWritable: true},
      {pubkey: userAccount, isSigner: false, isWritable: true},
      {pubkey: feeAccount, isSigner: false, isWritable: true},
      {pubkey: destinationMint, isSigner: false, isWritable: false},
      {pubkey: poolTokenProgramId, isSigner: false, isWritable: false},
      {pubkey: destinationTokenProgramId, isSigner: false, isWritable: false},
    ];
    return new TransactionInstruction({
      keys,
      programId: swapProgramId,
      data,
    });
  }
}