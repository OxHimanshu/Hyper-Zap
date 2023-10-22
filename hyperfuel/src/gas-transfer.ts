import {
  Received as ReceivedEvent,
  Sent as SentEvent
} from "../generated/GasTransfer/GasTransfer"
import { NativeTransfer } from "../generated/schema"

export function handleReceived(event: ReceivedEvent): void {
  let entity = new NativeTransfer(
    event.params.body
  )
  
  entity.sourceChain = event.params.origin
  entity.receiver = event.params.sender
  entity.sender = event.params.sender
  entity.status = "RECEIVED"
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSent(event: SentEvent): void {
  let entity = new NativeTransfer(
    event.params.message
  )

  entity.messageId = event.params.messageId
  entity.destinationChain = event.params.destinationChainSelector
  entity.sourceChain = event.params.sourceChainSelector
  entity.receiver = event.params.receiver
  entity.sender = event.params.receiver
  entity.fees = event.params.fees
  entity.status = "SENT"

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
