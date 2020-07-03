class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = [];

    for (let i = 0; i < this.rows; i++) {
      this.data[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] = 0;
      }
    }
  }

  static fromArray(arr) {
    let m = new Matrix(arr.length, 1);
    for (let i = 0; i < arr.length; i++) {
      m.data[i][0] = arr[i];
    }
    return m;
  }

  static subtract(a, b) {
    // Return a new Matrix a-b
    let result = new Matrix(a.rows, a.cols);
    for (let i = 0; i < result.rows; i++) {
      for (let j = 0; j < result.cols; j++) {
        result.data[i][j] = a.data[i][j] - b.data[i][j];
      }
    }
    return result;
  }

  toArray() {
    let arr = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        arr.push(this.data[i][j]);
      }
    }
    return arr;
  }

  randomize() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] = Math.random() * 2 - 1;
      }
    }
  }

  add(n) {
    if (n instanceof Matrix) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] += n.data[i][j];
        }
      }
    } else {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] += n;
        }
      }
    }
  }

  static transpose(matrix) {
    let result = new Matrix(matrix.cols, matrix.rows);
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        result.data[j][i] = matrix.data[i][j];
      }
    }
    return result;
  }

  static multiply(a, b) {
    // Matrix product
    if (a.cols !== b.rows) {
      console.error("Columns of A must match rows of B.");
      return undefined;
    }
    let result = new Matrix(a.rows, b.cols);
    for (let i = 0; i < result.rows; i++) {
      for (let j = 0; j < result.cols; j++) {
        // Dot product of values in col
        let sum = 0;
        for (let k = 0; k < a.cols; k++) {
          sum += a.data[i][k] * b.data[k][j];
        }
        result.data[i][j] = sum;
      }
    }
    return result;
  }

  multiply(n) {
    if (n instanceof Matrix) {
      // hadamard product
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] *= n.data[i][j];
        }
      }
    } else {
      // Scalar product
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] *= n;
        }
      }
    }
  }

  map(func) {
    // Apply a function to every element of matrix
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let val = this.data[i][j];
        this.data[i][j] = func(val);
      }
    }
  }

  static map(matrix, func) {
    let result = new Matrix(matrix.rows, matrix.cols);
    // Apply a function to every element of matrix
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        let val = matrix.data[i][j];
        result.data[i][j] = func(val);
      }
    }
    return result;
  }

  print() {
    console.table(this.data);
  }
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y) {
  // return sigmoid(x) * (1 - sigmoid(x));
  return y * (1 - y);
}

class NeuralNetwork {
  constructor(shape_array = []) {
    if (shape_array.length < 3) {
      console.error(
        "Invaild Neural Network Dimensions, expected [inputShape,....,outputShape]"
      );
      return;
    }
    this.shape_array = shape_array;
    this.input_nodes = this.shape_array[0];
    this.output_nodes = this.shape_array[this.shape_array.length - 1];
    this.learning_rate = 0.1;
    this.weights = [];
    this.bias = [];

    for (let i = 0; i < this.shape_array.length - 1; i++) {
      let l_weight = new Matrix(this.shape_array[i + 1], this.shape_array[i]);
      l_weight.randomize();
      this.weights.push(l_weight);

      let l_bias = new Matrix(this.shape_array[i + 1], 1);
      l_bias.randomize();
      this.bias.push(l_bias);
    }
  }

  predict(X) {
    let inputs = Matrix.fromArray(X);

    let layer = inputs;
    for (let i = 0; i < this.weights.length; i++) {
      layer = Matrix.multiply(this.weights[i], layer);
      layer.add(this.bias[i]);
      layer.map(sigmoid);
    }
    return layer.toArray();
  }
  fit(data, epochs, l_rate = 0.01, verbose = 1) {
    console.log(`
    Data Samples:${data.length}\n
    Activation:Sigmoid\n
    Epochs:${epochs}\n
    Learning Rate:${l_rate}
    `);

    this.learning_rate = l_rate;
    for (let i = 0; i < epochs; i++) {
      let d = data[Math.floor(Math.random() * data.length)];
      this.train(d.X, d.Y);
    }
  }
  train(X, Y) {
    let inputs = Matrix.fromArray(X);
    let layer = [];
    layer.push(inputs);
    for (let i = 0; i < this.weights.length; i++) {
      let l = Matrix.multiply(this.weights[i], layer[layer.length - 1]);
      l.add(this.bias[i]);
      l.map(sigmoid);
      layer.push(l);
    }
    let output = layer[layer.length - 1];
    let target = Matrix.fromArray(Y);
    let output_errors = Matrix.subtract(target, output);

    let gradients = Matrix.map(output, dsigmoid);
    gradients.multiply(output_errors);
    gradients.multiply(this.learning_rate);

    let w_t = Matrix.transpose(layer[layer.length - 2]);
    let delta = Matrix.multiply(gradients, w_t);
    this.weights[this.weights.length - 1].add(delta);
    this.bias[this.bias.length - 1].add(gradients);
    let hidden_error = output_errors;
    for (let i = this.weights.length - 1; i > 0; i--) {
      let t1 = Matrix.transpose(this.weights[i]);
      hidden_error = Matrix.multiply(t1, hidden_error);

      let hidden_gradient = Matrix.map(layer[i], dsigmoid);
      hidden_gradient.multiply(hidden_error);
      hidden_gradient.multiply(this.learning_rate);

      let i_T = Matrix.transpose(layer[i - 1]);
      let w_delta = Matrix.multiply(hidden_gradient, i_T);

      this.weights[i - 1].add(w_delta);
      this.bias[i - 1].add(hidden_gradient);
    }
  }
}
