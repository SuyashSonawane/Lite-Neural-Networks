let data = [
  {
    X: [0, 1],
    Y: [1],
  },
  {
    X: [1, 0],
    Y: [1],
  },
  {
    X: [0, 0],
    Y: [0],
  },
  {
    X: [1, 1],
    Y: [0],
  },
];

let nn = new NeuralNetwork([2, 5, 1]);

nn.fit(data, 50000, 0.1);
console.log(nn.feedForward([0, 1]));
console.log(nn.feedForward([1, 1]));
console.log(nn.feedForward([1, 0]));
console.log(nn.feedForward([0, 0]));
