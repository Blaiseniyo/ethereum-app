import Web3 from "web3";

export const VMError = "VM Exception while processing transaction: revert"

export const tokens = (n)=>{

    return new Web3.utils.BN(
        Web3.utils.toWei(n.toString(), "ether")
    )

}