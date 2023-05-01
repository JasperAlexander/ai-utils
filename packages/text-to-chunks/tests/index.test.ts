import { textToChunks } from '../src'

// 5.000 words
const longText = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae ornare urna, at pulvinar libero. Donec quis arcu tincidunt, rhoncus turpis ut, pellentesque odio. Integer nunc metus, tincidunt at tellus ut, rhoncus imperdiet felis. Vestibulum porta, nibh nec gravida faucibus, erat libero ultricies lectus, sed tincidunt libero elit ac magna. Donec commodo ac justo vitae tempor. Phasellus commodo tristique nulla et maximus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam scelerisque sodales libero nec maximus. Aliquam at vehicula libero. In hac habitasse platea dictumst. Nam interdum in nibh porttitor sagittis. In mattis dolor sapien, a molestie nibh molestie ac. Aliquam lobortis nisi et sapien lacinia, sit amet elementum leo pharetra. Fusce eu finibus lacus.

Sed lacus sapien, placerat quis felis ac, molestie euismod dolor. Aenean maximus nibh in ex lobortis mattis. Etiam elementum nec massa suscipit tempor. Vestibulum felis lectus, venenatis sed tincidunt in, mattis in tellus. Nam sodales mi sed erat lobortis, in rutrum ligula porta. Phasellus at enim et magna dapibus lobortis. Maecenas fringilla diam at consectetur feugiat. Fusce vehicula, dui non sodales dictum, turpis ante tempor mauris, ultrices mattis augue tortor id tellus. Nullam tincidunt tincidunt massa et semper. Aenean non velit a arcu eleifend molestie a sed risus. Praesent malesuada sapien tellus, dapibus ullamcorper magna convallis at. Suspendisse id ullamcorper erat. In tristique a mi et lobortis. Praesent non turpis eu ipsum sodales imperdiet ut et est.

Fusce quis rutrum dolor. Sed quis mi aliquam, pharetra nunc in, finibus orci. Donec vel mattis sapien. Proin quis nulla quam. Aliquam maximus imperdiet interdum. Nulla euismod aliquet sapien eget pellentesque. Curabitur eu accumsan ante. Donec congue congue velit vitae tincidunt. Proin vestibulum, nisi non semper semper, dolor sapien egestas sapien, eu porta ligula lorem at ipsum. Duis quis tortor suscipit, sagittis mauris a, tempus nisl. In finibus magna quis rutrum consectetur. Suspendisse pulvinar ut nibh a volutpat. Ut vestibulum libero non nibh commodo, id bibendum diam aliquet. Aenean facilisis suscipit diam, quis faucibus nibh mattis sed.

Curabitur imperdiet gravida tortor, tempor fermentum ligula faucibus sodales. Phasellus erat ante, cursus id iaculis at, suscipit gravida diam. Fusce ex lorem, euismod ut auctor at, sagittis quis ex. Etiam eget mauris elit. Praesent aliquam lobortis purus at fringilla. Duis eu sem ut lectus gravida ornare et quis est. Aliquam elit erat, placerat sit amet erat eget, cursus consectetur enim. Pellentesque bibendum, felis viverra porttitor maximus, mi tortor elementum arcu, ut lobortis justo ipsum sed leo. Vivamus vitae augue nec nibh porta pellentesque. In eu nulla leo.

Suspendisse molestie vestibulum vestibulum. Pellentesque placerat lectus nec mi luctus gravida. Vivamus hendrerit rhoncus est, id finibus mauris cursus in. Praesent sed placerat erat, rhoncus convallis dui. Curabitur pharetra nisi nisl, vel auctor ipsum lobortis nec. Mauris nec fringilla leo, vitae blandit diam. Nunc dictum cursus arcu, eget gravida enim tempor a. Sed rutrum dui ut sodales euismod. Nam id metus vitae ligula tempus feugiat. Pellentesque leo neque, volutpat nec facilisis sed, laoreet a ligula. Cras mattis hendrerit aliquam. Integer varius mollis tristique. Praesent.
`

describe('textToChunks()', () => {
    it('should split a string into multiple chunks', async() => {
        const chunks = textToChunks({text: longText})
        expect(chunks.length).toBeGreaterThan(1)
    })
})
