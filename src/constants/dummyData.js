export const demoChoreo = {
  createdAt: { seconds: 1540148067, nanoseconds: 77000000 },
  creator: { id: "LrG4PV9PpwgieRuMa5YsSQ2iSUo1", name: "John Phua" },
  dancers: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"],
  imageUrl: "https://dummyimage.com/300x300/000000/fff.jpg&text=L",
  formations: [{
    dancers: [
      { name: "f", position: [0.5016886187098953, 0.49240121580547114] },
      { name: "e", position: [0.6148260722728809, 0.3302938196555218] },
      { name: "d", position: [0.726274907125971, 0.16312056737588654] },
      { name: "k", position: [0.2737250928740291, 0.1656534954407295] },
      { name: "g", position: [0.38855116514690985, 0.3302938196555218] },
      { name: "c", position: [0.7195204322863897, 0.41134751773049644] },
      { name: "b", position: [0.726274907125971, 0.6519756838905775] },
      { name: "j", position: [0.27203647416413373, 0.41894630192502536] },
      { name: "i", position: [0.27541371158392436, 0.6519756838905775] },
      { name: "a", position: [0.7296521445457615, 0.8343465045592704] },
      { name: "h", position: [0.2771023302938197, 0.8343465045592704] }
    ],
    name: "Landing Demo Formation",
    duration: 5000,
    transitionBefore: {
      duration: 0,
      midPoint: 0
    }
  }],
  name: "Landing Demo",
  published: false,
  stageDim: { gridSize: 0.5, height: 6, units: "m", width: 9 },
  updatedAt: { seconds: 1540148283, nanoseconds: 441000000 }
};

export const demoChoreos = {
  byId: {
    demo: demoChoreo
  },
  myChoreos: []
};

export const genDummyImage = (name) => {
  return "https://dummyimage.com/300x300/000000/fff.jpg&text=" + name.charAt(0);
};