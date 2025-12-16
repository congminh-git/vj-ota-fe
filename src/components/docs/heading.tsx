import { JSX } from "react"

export const Heading = ({ id, level, children }: any) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements
  return <Tag id={id}>{children}</Tag>
}