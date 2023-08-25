import { ExpressAdapter } from "@bull-board/express";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
// import { BullAdapter } from "@bull-board/api/bullAdapter";
import { createBullBoard } from "@bull-board/api";
import { queues } from "./queues";

export const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/que");

/*const { addQueue, removeQueue, setQueues, replaceQueues } = */ createBullBoard({
  queues: queues.map((que) => new BullMQAdapter(que.Queue)),
  //   queues: queues.map((que) => new BullAdapter(que.Queue)),
  serverAdapter: serverAdapter,
  //   options: {
  //     uiConfig: {
  //       boardTitle: "Nourisha",
  //       boardLogo: {
  //         path: "https://res.cloudinary.com/drivfk4v3/image/upload/v1688665730/Nourisha/logo-icon_frbirl.png",
  //         width: "32px",
  //         // height: 200,
  //       },
  //       miscLinks: [{ text: "Logout", url: "/logout" }],
  //       //   favIcon: {
  //       //     default: "static/images/logo.svg",
  //       //     alternative: "static/favicon-32x32.png",
  //       //   },
  //     },
  //   },
});
