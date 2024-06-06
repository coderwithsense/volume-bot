import { Cluster, Raydium, TxVersion, parseTokenAccountResp } from '@raydium-io/raydium-sdk-v2'
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import base58 from 'bs58';

let raydium

export const owner = Keypair.fromSecretKey(base58.decode("5vRKt7xWDSQjFXDnuvsPY8QhYfGYNQSKyqocWgGm3hfkWKCn5XvLvNzuK6T6mb872ar9Uxw2gWHENdsMLBxMdLoR"))
export const connection = new Connection(clusterApiUrl(process.env.NEXT_PUBLIC_SOLANA_NETWORK), "confirmed")
export const txVersion = TxVersion.V0

export const initRaydiumSdk = async (params) => {
    if (raydium) {
        return raydium;
    }
    raydium = await Raydium.load({
        owner, 
        connection,
        cluster: process.env.NEXT_PUBLIC_SOLANA_NETWORK,
        disableFeatureCheck: true,
        disableLoadToken: !params?.loadToken,
    })
    raydium.account.updateTokenAccount(await fetchTokenAccountData())
    connection.onAccountChange(owner.publicKey, async (info) => {
        raydium?.account.updateTokenAccount(await fetchTokenAccountData())
    })
    return raydium;
}

export const fetchTokenAccountData = async () => {
    const solAccountResp = await connection.getAccountInfo(owner.publicKey)
    const tokenAccountResp = await connection.getTokenAccountsByOwner(owner.publicKey, { programId: TOKEN_PROGRAM_ID })
    const token2022Req = await connection.getTokenAccountsByOwner(owner.publicKey, { programId: TOKEN_2022_PROGRAM_ID })
    const tokenAccountData = parseTokenAccountResp({
      owner: owner.publicKey,
      solAccountResp,
      tokenAccountResp: {
        context: tokenAccountResp.context,
        value: [...tokenAccountResp.value, ...token2022Req.value],
      },
    })
    return tokenAccountData
  }