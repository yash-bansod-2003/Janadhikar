import {
  Check,
  Loader,
  X,
  type Icon as LucideIcon,
  type LucideProps,
} from "lucide-react"

export type Icon = typeof LucideIcon

export const Icons = {
  loader: Loader,
  check: Check,
  x: X,
  logo: ({ ...props }: LucideProps) => (
    <svg
      fill="#db0a0a"
      height="100px"
      width="100px"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="-143 145 512 512"
      xmlSpace="preserve"
      stroke="#db0a0a"
      {...props}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g id="SVGRepo_iconCarrier">
        <path d="M113,145c-141.4,0-256,114.6-256,256s114.6,256,256,256s256-114.6,256-256S254.4,145,113,145z M41.4,457.4 C10.3,457.4-15,432.1-15,401c0-31.1,25.2-56.4,56.4-56.4c31.2,0,56.4,25.3,56.4,56.4C97.8,432.1,72.6,457.4,41.4,457.4z M184.6,457.4c-31.2,0-56.4-25.3-56.4-56.4c0-31.1,25.2-56.4,56.4-56.4c31.1,0,56.4,25.3,56.4,56.4 C241,432.1,215.8,457.4,184.6,457.4z" />
      </g>
    </svg>
  ),
}
