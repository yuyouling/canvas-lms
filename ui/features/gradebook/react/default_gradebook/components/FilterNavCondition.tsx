/*
 * Copyright (C) 2021 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React, {useRef} from 'react'
// @ts-ignore
import I18n from 'i18n!gradebook'
import {Flex} from '@instructure/ui-flex'
import {SimpleSelect} from '@instructure/ui-simple-select'
import {ScreenReaderContent} from '@instructure/ui-a11y-content'
import {IconButton} from '@instructure/ui-buttons'
import {IconTrashLine} from '@instructure/ui-icons'
import CanvasDateInput from '@canvas/datetime/react/components/DateInput'
import moment from 'moment'
import {MomentInput} from 'moment-timezone'
import tz from '@canvas/timezone'

const {Item} = Flex as any
const {Option} = SimpleSelect as any
const formatDate = date => tz.format(date, 'date.formats.medium')
const dateLabels = {'start-date': I18n.t('Start Date'), 'end-date': I18n.t('End Date')}

export default function ({
  condition,
  conditionsInFilter,
  onChange,
  modules,
  assignmentGroups,
  sections,
  onDelete
}) {
  const divRef = useRef(null)

  let items = []
  switch (condition.type) {
    case 'module':
      items = modules.map(({id, name}) => [id, name])
      break
    case 'assignment-group':
      items = assignmentGroups.map(({id, name}) => [id, name])
      break
    case 'section':
      items = sections.map(({id, name}) => [id, name])
      break
  }

  const shouldShowDateOption = type => {
    const isSelectedType = condition.type === type
    const isTypeAlreadyInFilter = conditionsInFilter.some(condition_ => condition_.type === type)
    return isSelectedType || !isTypeAlreadyInFilter
  }

  return (
    <Flex justifyItems="space-between" elementRef={el => (divRef.current = el)}>
      <Item>
        <SimpleSelect
          width="95%"
          renderLabel={<ScreenReaderContent>{I18n.t('Condition type')}</ScreenReaderContent>}
          placeholder={I18n.t('Select condition type')}
          value={condition.type || '_'}
          size="small"
          onChange={(_event, {value}) =>
            onChange({
              ...condition,
              type: value
            })
          }
        >
          {modules.length > 0 && (
            <Option id={`${condition.id}-module`} value="module">
              {I18n.t('Module')}
            </Option>
          )}

          {assignmentGroups.length > 0 && (
            <Option id={`${condition.id}-assignment-group`} value="assignment-group">
              {I18n.t('Assignment Group')}
            </Option>
          )}

          {sections.length > 0 && (
            <Option id={`${condition.id}-section`} value="section">
              {I18n.t('Section')}
            </Option>
          )}

          {shouldShowDateOption('start-date') && (
            <Option id={`${condition.id}-start-date`} value="start-date">
              {I18n.t('Start Date')}
            </Option>
          )}

          {shouldShowDateOption('end-date') && (
            <Option id={`${condition.id}-end-date`} value="end-date">
              {I18n.t('End Date')}
            </Option>
          )}
        </SimpleSelect>
      </Item>
      <Flex>
        {['module', 'assignment-group', 'section'].includes(condition.type) && (
          <SimpleSelect
            key={condition.type} // resets dropdown when condition type is changed
            renderLabel={<ScreenReaderContent>{I18n.t('Condition')}</ScreenReaderContent>}
            size="small"
            placeholder={I18n.t('Select condition')}
            value={condition.value || '_'}
            onChange={(_event, {value}) => {
              onChange({
                ...condition,
                value
              })
            }}
          >
            {items.map(([id, name]: [string, string]) => {
              return (
                <Option key={id} id={`${condition.id}-item-${id}`} value={id}>
                  {name}
                </Option>
              )
            })}
          </SimpleSelect>
        )}
        {['start-date', 'end-date'].includes(condition.type) && (
          <CanvasDateInput
            size="small"
            dataTestid="date-input"
            renderLabel={<ScreenReaderContent>{dateLabels[condition.type]}</ScreenReaderContent>}
            selectedDate={condition.value}
            formatDate={formatDate}
            interaction="enabled"
            onSelectedDateChange={(value: MomentInput) => {
              onChange({
                ...condition,
                value: value ? moment(value).toISOString() : null
              })
            }}
          />
        )}
        <IconButton
          onClick={() => onDelete(condition, divRef)}
          screenReaderLabel={I18n.t('Delete condition')}
          withBackground={false}
          withBorder={false}
        >
          <IconTrashLine />
        </IconButton>
      </Flex>
    </Flex>
  )
}
