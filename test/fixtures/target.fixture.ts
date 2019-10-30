import { lorem, random, finance } from 'faker'

export const generateCluttered = (ammount: number) => {
  const mockTargets = []
  for (let i = 0; i < ammount; i++) {
    mockTargets.push({
      title: `${lorem.word()}${i}`,
      radius: random.number({ min:190, max:210 }),
      latitude: finance.amount(43.0192, 43.0193, 6),
      longitude: finance.amount(-23.9818, -23.9819, 6),
    })
  }
  return mockTargets
}
