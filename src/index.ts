import { Guide } from './components'
import {
  IGuide, IStep, SelectorType, ContentType, Placement,
} from './typings/guide'

/** import global styles */
import './styles/index.less'

export type {
  IGuide, IStep, SelectorType, ContentType, Placement,
}
export default Guide

export * from './constants/className'
