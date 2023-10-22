import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { Received } from "../generated/schema"
import { Received as ReceivedEvent } from "../generated/GasTransfer/GasTransfer"
import { handleReceived } from "../src/gas-transfer"
import { createReceivedEvent } from "./gas-transfer-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let origin = BigInt.fromI32(234)
    let sender = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let body = Bytes.fromI32(1234567890)
    let newReceivedEvent = createReceivedEvent(origin, sender, body)
    handleReceived(newReceivedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Received created and stored", () => {
    assert.entityCount("Received", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Received",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "origin",
      "234"
    )
    assert.fieldEquals(
      "Received",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "sender",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Received",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "body",
      "1234567890"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
