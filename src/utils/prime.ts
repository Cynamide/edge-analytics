/**
 * Check if a number is prime.
 */
export function isPrime(n: number): boolean {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
  
    for (let i = 3; i * i <= n; i += 2) {
      if (n % i === 0) return false;
    }
    return true;
}
  
/**
 * Generate the next `count` primes starting from `start`.
 */
export function getConsecutivePrimes(start: number, count: number): number[] {
    const primes: number[] = [];
    let candidate = start;

    while (primes.length < count) {
        if (isPrime(candidate)) {
        primes.push(candidate);
        }
        candidate++;
    }

    return primes;
}