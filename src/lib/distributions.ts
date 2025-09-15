import { type Distribution } from "@/types/generator"

export function sample(dist: Distribution, rng: () => number): number {
  switch (dist.kind) {
    case 'uniforme': {
      const { min, max } = dist.params
      return min + (max - min) * rng()
    }
    case 'exponencial': {
      const { lambda } = dist.params
      const u = Math.max(1e-12, rng())
      return -Math.log(u) / lambda
    }
    case 'normal': {
      const { mu, sigma } = dist.params
      const u1 = Math.max(1e-12, rng())
      const u2 = Math.max(1e-12, rng())
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
      return mu + sigma * z
    }
    case 'fijo':
      return dist.params.value
  }
}
