import { Activity, ActivityType } from "../types/contracts"
import { Edge } from "../types/pagination"
import { emptyPage, testPageOf } from "./utils"

const extrinsic = {
  id: "0000727898-000002-f645f",
  blockNumber: "727898",
  indexInBlock: "2",
  success: true,
  createdAt: new Date(),
  name: "module.call",
  args: {
    data: "0x0"
  }
}

const edges : Edge<Activity>[] = [
  {
    node: {
      type: ActivityType.CONTRACTCALL,
      action: "call",
      id: "0000727898-000002-f645f-CONTRACTCALL",
      createdAt: new Date(),
      extrinsic,
      args: {
        data: "0x0"
      },
      to: {
        id: "5Hh1Zsd5kJ1v9RdbKXQvVS93CmwErJPC86g4s7qzEJzvZLiE"
      },
      from: {
        id: "5DVQiQYBcMUm5YeQ4YoG54aRsiBtDr6P4iSTUvxntdXCrYgz"
      }
    }
  },
  {
    node: {
      type: ActivityType.CODEUPDATED,
      action: "call",
      id: "0000727898-000002-f645f-UPDATE",
      createdAt: new Date(),
      extrinsic,
      args: {
        data: "0x0"
      },
      to: {
        id: "5Hh1Zsd5kJ1v9RdbKXQvVS93CmwErJPC86g4s7qzEJzvZLiE"
      },
      from: {
        id: "5DVQiQYBcMUm5YeQ4YoG54aRsiBtDr6P4iSTUvxntdXCrYgz"
      }
    }
  },
  {
    node: {
      type: ActivityType.CONTRACTTERMINATE,
      action: "call",
      id: "0000727898-000002-f645f-TERMINATE",
      createdAt: new Date(),
      extrinsic,
      args: {
        data: "0x0"
      },
      to: {
        id: "5Hh1Zsd5kJ1v9RdbKXQvVS93CmwErJPC86g4s7qzEJzvZLiE"
      },
      from: {
        id: "5DVQiQYBcMUm5YeQ4YoG54aRsiBtDr6P4iSTUvxntdXCrYgz"
      }
    }
  },
  {
    node: {
      type: ActivityType.CONTRACT,
      action: "call",
      id: "0000727898-000002-f645f-CONTRACT",
      createdAt: new Date(),
      extrinsic,
      args: {
        code: "0x0",
        data: "0x0"
      },
      to: {
        id: "5Hh1Zsd5kJ1v9RdbKXQvVS93CmwErJPC86g4s7qzEJzvZLiE"
      },
      from: {
        id: "5DVQiQYBcMUm5YeQ4YoG54aRsiBtDr6P4iSTUvxntdXCrYgz"
      }
    }
  },
  {
    node:
      {
        type: "UNK",
        action: "unk",
        id: "0000727898-000002-f645f-UNK",
        createdAt: new Date(),
        extrinsic,
        args: {
          data: "0x0"
        },
        to: {
          id: "5Hh1Zsd5kJ1v9RdbKXQvVS93CmwErJPC86g4s7qzEJzvZLiE"
        },
        from: {
          id: "5DVQiQYBcMUm5YeQ4YoG54aRsiBtDr6P4iSTUvxntdXCrYgz"
        }
      }
  }
]

export default {
  connections: {
    activitiesConnection: testPageOf(edges)
  },
  emptyConnections: {
    activitiesConnection: emptyPage()
  }
}
