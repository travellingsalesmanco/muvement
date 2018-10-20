import { defaultStageDim } from "./defaults";

export const dummyDance = {
  name: "NUS Blast! Showcase",
  stageDim: defaultStageDim,
  dancers: ["Bob", "Marley", "And", "Me", "John"],
  frames: [
    {
      name: "Introduction",
      numSeconds: 30,
      dancers: [
        {
          name: "Bob",
          position: [0.5, 0.5]
        },
        {
          name: "Marley",
          position: [0.1, 0.1]
        },
        {
          name: "And",
          position: [0.9, 0.9]
        },
        {
          name: "Me",
          position: [0.1, 0.9]
        },
        {
          name: "John",
          position: [0.9, 0.1]
        }
      ]
    }
  ]
};
export const dummyDances = {
  byId: {
    "abcde": dummyDance
  },
  myDances: ["abcde"]
}