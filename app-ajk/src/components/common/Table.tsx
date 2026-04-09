import type { ReactNode } from 'react'

type Props = { headers: string[]; children: ReactNode }

export function Table({ headers, children }: Props) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}
