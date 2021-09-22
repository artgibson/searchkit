import { omitBy, isNil } from 'lodash'
import { GeoShapePointFilter } from '../core/QueryManager'
import { BaseFilter } from './BaseFilter'

interface GeoShapePointFilterConfig {
  identifier: string
  field: string
  label: string
  display?: 'GeoShapePointFilter' | string
}

class GeoShapePointFilterClass implements BaseFilter {
  public excludeOwnFilters = false

  constructor(public config: GeoShapePointFilterConfig) {}
  getLabel(): string {
    return this.config.label
  }

  getIdentifier() {
    return this.config.identifier
  }

  getFilters(filters: Array<GeoShapePointFilter>) {
    const newfilters = {
      geo_shape: {
        [this.config.field]: omitBy(
          {
            shape: filters[0].geoShapePoint.shape,
            relation: filters[0].geoShapePoint.relation
          },
          isNil
        )
      }
    }
    return newfilters
  }

  getSelectedFilter(filterSet) {
    const c = filterSet.geoShapePoint
    return {
      type: 'GeoShapePointSelectedFilter',
      id: `${this.getIdentifier()}_${JSON.stringify(c)}`,
      identifier: this.getIdentifier(),
      label: this.getLabel(),
      shape: c.shape,
      relation: c.relation,
      display: this.config.display || 'GeoShapePointFilter'
    }
  }
}

export default GeoShapePointFilterClass
