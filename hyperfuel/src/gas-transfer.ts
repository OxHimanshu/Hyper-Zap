import {
  Received as ReceivedEvent,
  Sent as SentEvent
} from "../generated/GasTransfer/GasTransfer"
import { Received, Sent } from "../generated/schema"

export function handleReceived(event: ReceivedEvent): void {
  let entity = new Received(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.origin = event.params.origin
  entity.sender = event.params.sender
  entity.body = event.params.body

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSent(event: SentEvent): void {
  let entity = new Sent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.messageId = event.params.messageId
  entity.destinationChainSelector = event.params.destinationChainSelector
  entity.sourceChainSelector = event.params.sourceChainSelector
  entity.receiver = event.params.receiver
  entity.fees = event.params.fees
  entity.message = event.params.message

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
