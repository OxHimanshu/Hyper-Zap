import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { Received, Sent } from "../generated/GasTransfer/GasTransfer"

export function createReceivedEvent(
  origin: BigInt,
  sender: Address,
  body: Bytes
): Received {
  let receivedEvent = changetype<Received>(newMockEvent())

  receivedEvent.parameters = new Array()

  receivedEvent.parameters.push(
    new ethereum.EventParam("origin", ethereum.Value.fromUnsignedBigInt(origin))
  )
  receivedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  receivedEvent.parameters.push(
    new ethereum.EventParam("body", ethereum.Value.fromBytes(body))
  )

  return receivedEvent
}

export function createSentEvent(
  messageId: Bytes,
  destinationChainSelector: BigInt,
  sourceChainSelector: BigInt,
  receiver: Address,
  fees: BigInt,
  message: Bytes
): Sent {
  let sentEvent = changetype<Sent>(newMockEvent())

  sentEvent.parameters = new Array()

  sentEvent.parameters.push(
    new ethereum.EventParam(
      "messageId",
      ethereum.Value.fromFixedBytes(messageId)
    )
  )
  sentEvent.parameters.push(
    new ethereum.EventParam(
      "destinationChainSelector",
      ethereum.Value.fromUnsignedBigInt(destinationChainSelector)
    )
  )
  sentEvent.parameters.push(
    new ethereum.EventParam(
      "sourceChainSelector",
      ethereum.Value.fromUnsignedBigInt(sourceChainSelector)
    )
  )
  sentEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  sentEvent.parameters.push(
    new ethereum.EventParam("fees", ethereum.Value.fromUnsignedBigInt(fees))
  )
  sentEvent.parameters.push(
    new ethereum.EventParam("message", ethereum.Value.fromBytes(message))
  )

  return sentEvent
}
