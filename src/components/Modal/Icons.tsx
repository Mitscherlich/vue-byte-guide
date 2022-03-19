import { defineComponent, toRefs } from 'vue'

export interface CloseSmallProps {
  size?: number
  fill?: string
}

export const CloseSmall = defineComponent<CloseSmallProps>((props, ctx) => {
  const { size, fill } = toRefs(props)

  const onClick = () => {
    ctx.emit('click')
  }

  return () => (
    <div onClick={onClick}>
      <svg
        width={size?.value}
        height={size?.value}
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <g>
            <rect
              fill-opacity="0.01"
              fill="#FFFFFF"
              x="0"
              y="0"
              width="48"
              height="48"
              stroke-width="4"
              stroke="none"
              fill-rule="evenodd"
            />
            <path
              d="M14,14 L34,34"
              stroke={fill?.value}
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
              fill-rule="evenodd"
            />
            <path
              d="M14,34 L34,14"
              stroke={fill?.value}
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
              fill-rule="evenodd"
            />
          </g>
        </g>
      </svg>
    </div>
  )
})

CloseSmall.props = {
  size: Number,
  fill: String,
}
CloseSmall.name = 'CloseIcon'
