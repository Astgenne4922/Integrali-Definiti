%{
sostituzione in avanti

x_i = (b_i - sum_{1, i-1}(a_ij*x_j)) / a_ii		i = 1...n
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
sostituzione all'indietro

x_i = (b_i - sum_{i+1, n}(a_ij*x_j)) / a_ii 	i = n...1
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
gauss

a_ij(k+1) = m_ik*a_kj(k) + a_ij(k)
b_i(k+1)  = mik*b_i(k) + bi(k)
m_ik 	  = -a_ik(k) / a_kk(k)
i = k+1...n
j = k+1...n
k = 1...n-1
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
LU

LUx = b -> Ly = b -> Ux = y
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Cholesky

b_ii = sqrt(a_ii - sum_{1,i-1}(b_ik^2))			j = i
b_ij = (a_ij - sum_{1,i-1}(b_ik*b_k)) / b_ii 	j = i+1...n
i = 1...n
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Jacobi

A = D + C
D = diag(diag(A))
C = A - D
x = -D^-1 * C * x_prev + D^-1 * b
	|	B_j	 |			 |	q_j	 |
	
x_i = 1/a_ii * (-sum_{j~=i,1,n}(a_ij*x_prev_j) + b_i) i = 1...n
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Gauss-Seidel

A = D + E + F
D = diag(diag(A))
E = tril(A) - D
F = triu(A) - D

x = -(E + D)^-1 * F * x_prev + (E + D)^-1 * b
	|		B_j	   |		   |	q_j		|
	
x_i = 1/a_ii * (b_i - sum_{1,i-1}(a_ij*x_prev_j) - sum_{i+1,n}(a_ij*x_prev_j)) i = 1...n
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Forma di Lagrange

p(x) = sum_{0,n}(y_i * L_i(x))
L_i(x) = prod_{j~=i,0,n}((x - x_j) / (x_i - x_j))
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Forma di Newton

p2(x) = f[x0] + f[x0,x1](x-x0) + f[x0,x1,x2](x-x0)(x-x1)

f[xi,xi+1] = (f[xi+1] - f[xi]) / (xi+1 - xi)
f[xi,xi+1,xi+2] = (f[xi+1,xi+2] - f[xi,xi+1]) / (xi+2 - xi)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Chebyshev

x_i = cos((2i+1)/(2n+2)*pi)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Middle 

I[f] = f(a+b/2) * (b-a)
I = H * sum_{0,m-1}(f(x_i+x_i+1/2))
H = b-a/m
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Trapezio

I[f] = (f(a) + f(b)) / (b-a)/2
I = H/2 * (f(x_0) + 2sum_{1,m-1}(f(x_i)) + f(x_m))
H = b-a/m
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Cavalieri-Simpson

I[f] = b-a/6 * (f(a) + 4f(a+b/2) + f(b))
I = H/6 * sum_{1,m}(f(x_i-1) + 4f(x_i-1+x_i/2) + f(x_i))
H = b-a/m
}%
