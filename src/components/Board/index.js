import React from 'react'
import * as s from './index.scss'
import { List } from 'immutable'

const Chessman = ({ chessman, isLast }) => {
  const color = chessman === 0 ? 'black' : 'white'
  return <div className={`${s[color]} ${s.chessman}`}>{isLast && '+'}</div>
}

const Cell = ({ cell, pos, play, lastPos }) => {
  const handleClick = () => {
    cell === null && play(pos)
  }
  const isLast = List(pos).equals(List(lastPos))
  return (
    <div className={s.cell} onClick={handleClick}>
      {cell !== null && <Chessman chessman={cell} isLast={isLast} />}
    </div>
  )
}

const Row = props => {
  const { row, rowIndex } = props
  return (
    <div className={s.row}>
      {row.map((i, index) => {
        return <Cell key={index} pos={[rowIndex, index]} cell={i} {...props} />
      })}
    </div>
  )
}

const Board = props => {
  const { data } = props
  return (
    <div className={s.board}>
      {data.map((i, index) => {
        return <Row key={index} row={i} rowIndex={index} {...props} />
      })}
    </div>
  )
}

export default Board
