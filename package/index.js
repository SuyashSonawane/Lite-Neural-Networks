class Matrix {
    constructor(t, s) {
        this.rows = t, this.cols = s, this.data = [];
        for (let t = 0; t < this.rows; t++) {
            this.data[t] = [];
            for (let s = 0; s < this.cols; s++) this.data[t][s] = 0
        }
    }
    static fromArray(t) {
        let s = new Matrix(t.length, 1);
        for (let a = 0; a < t.length; a++) s.data[a][0] = t[a];
        return s
    }
    static subtract(t, s) {
        let a = new Matrix(t.rows, t.cols);
        for (let r = 0; r < a.rows; r++)
            for (let i = 0; i < a.cols; i++) a.data[r][i] = t.data[r][i] - s.data[r][i];
        return a
    }
    toArray() {
        let t = [];
        for (let s = 0; s < this.rows; s++)
            for (let a = 0; a < this.cols; a++) t.push(this.data[s][a]);
        return t
    }
    randomize() {
        for (let t = 0; t < this.rows; t++)
            for (let s = 0; s < this.cols; s++) this.data[t][s] = 2 * Math.random() - 1
    }
    add(t) {
        if (t instanceof Matrix)
            for (let s = 0; s < this.rows; s++)
                for (let a = 0; a < this.cols; a++) this.data[s][a] += t.data[s][a];
        else
            for (let s = 0; s < this.rows; s++)
                for (let a = 0; a < this.cols; a++) this.data[s][a] += t
    }
    static transpose(t) {
        let s = new Matrix(t.cols, t.rows);
        for (let a = 0; a < t.rows; a++)
            for (let r = 0; r < t.cols; r++) s.data[r][a] = t.data[a][r];
        return s
    }
    static multiply(t, s) {
        if (t.cols !== s.rows) return void console.error("Columns of A must match rows of B.");
        let a = new Matrix(t.rows, s.cols);
        for (let r = 0; r < a.rows; r++)
            for (let i = 0; i < a.cols; i++) {
                let e = 0;
                for (let a = 0; a < t.cols; a++) e += t.data[r][a] * s.data[a][i];
                a.data[r][i] = e
            }
        return a
    }
    multiply(t) {
        if (t instanceof Matrix)
            for (let s = 0; s < this.rows; s++)
                for (let a = 0; a < this.cols; a++) this.data[s][a] *= t.data[s][a];
        else
            for (let s = 0; s < this.rows; s++)
                for (let a = 0; a < this.cols; a++) this.data[s][a] *= t
    }
    map(t) {
        for (let s = 0; s < this.rows; s++)
            for (let a = 0; a < this.cols; a++) {
                let r = this.data[s][a];
                this.data[s][a] = t(r)
            }
    }
    static map(t, s) {
        let a = new Matrix(t.rows, t.cols);
        for (let r = 0; r < t.rows; r++)
            for (let i = 0; i < t.cols; i++) {
                let e = t.data[r][i];
                a.data[r][i] = s(e)
            }
        return a
    }
    print() {
        console.table(this.data)
    }
}

function sigmoid(t) {
    return 1 / (1 + Math.exp(-t))
}

function dsigmoid(t) {
    return t * (1 - t)
}
class NeuralNetwork {
    constructor(t = []) {
        if (t.length < 3) console.error("Invaild Neural Network Dimensions, expected [inputShape,....,outputShape]");
        else {
            this.shape_array = t, this.input_nodes = this.shape_array[0], this.output_nodes = this.shape_array[this.shape_array.length - 1], this.learning_rate = .1, this.weights = [], this.bias = [];
            for (let t = 0; t < this.shape_array.length - 1; t++) {
                let s = new Matrix(this.shape_array[t + 1], this.shape_array[t]);
                s.randomize(), this.weights.push(s);
                let a = new Matrix(this.shape_array[t + 1], 1);
                a.randomize(), this.bias.push(a)
            }
        }
    }
    predict(t) {
        let s = Matrix.fromArray(t);
        for (let t = 0; t < this.weights.length; t++)(s = Matrix.multiply(this.weights[t], s)).add(this.bias[t]), s.map(sigmoid);
        return s.toArray()
    }
    fit(t, s, a = .01, r = 1) {
        console.log(`\n    Data Samples:${t.length}\n\n    Activation:Sigmoid\n\n    Epochs:${s}\n\n    Learning Rate:${a}\n    `), this.learning_rate = a;
        for (let a = 0; a < s; a++) {
            let s = t[Math.floor(Math.random() * t.length)];
            this.train(s.X, s.Y)
        }
    }
    train(t, s) {
        let a = Matrix.fromArray(t),
            r = [];
        r.push(a);
        for (let t = 0; t < this.weights.length; t++) {
            let s = Matrix.multiply(this.weights[t], r[r.length - 1]);
            s.add(this.bias[t]), s.map(sigmoid), r.push(s)
        }
        let i = r[r.length - 1],
            e = Matrix.fromArray(s),
            l = Matrix.subtract(e, i),
            o = Matrix.map(i, dsigmoid);
        o.multiply(l), o.multiply(this.learning_rate);
        let h = Matrix.transpose(r[r.length - 2]),
            n = Matrix.multiply(o, h);
        this.weights[this.weights.length - 1].add(n), this.bias[this.bias.length - 1].add(o);
        let d = l;
        for (let t = this.weights.length - 1; t > 0; t--) {
            let s = Matrix.transpose(this.weights[t]);
            d = Matrix.multiply(s, d);
            let a = Matrix.map(r[t], dsigmoid);
            a.multiply(d), a.multiply(this.learning_rate);
            let i = Matrix.transpose(r[t - 1]),
                e = Matrix.multiply(a, i);
            this.weights[t - 1].add(e), this.bias[t - 1].add(a)
        }
    }
}

module.exports = NeuralNetwork