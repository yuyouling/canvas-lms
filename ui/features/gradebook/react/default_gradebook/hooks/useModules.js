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

import {useState, useEffect} from 'react'
import I18n from 'i18n!gradebook'

const useModules = (dispatch, courseId, contextModulesPerPage, enabled = true) => {
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState([])
  const [data, setData] = useState([])

  useEffect(() => {
    const params = {per_page: contextModulesPerPage}
    const url = `/api/v1/courses/${courseId}/modules`
    if (enabled) {
      setLoading(true)
      dispatch
        .getDepaginated(url, params)
        .then(contextModules => {
          setData(contextModules)
          setLoading(false)
        })
        .catch(() => {
          setErrors([
            {
              key: 'modules-loading-error',
              message: I18n.t('There was an error fetching modules.'),
              variant: 'error'
            }
          ])
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [enabled, contextModulesPerPage, dispatch, courseId])

  return {loading, errors, data}
}

export default useModules
