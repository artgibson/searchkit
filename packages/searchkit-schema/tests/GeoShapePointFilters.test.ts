import nock from 'nock'
import { SearchkitConfig } from '../src/resolvers/ResultsResolver'
import { MultiMatchQuery, RefinementSelectFacet, GeoShapePointFilter } from '../src'
import { setupTestServer, callQuery } from './support/helper'
import HitsMock from './__mock-data__/FacetsResolver/results.json'

describe('Geo Filters', () => {
  describe('should return as expected', () => {
    const runQuery = async (gql) => {
      const response = await callQuery({ gql })
      return response
    }

    const config: SearchkitConfig = {
      host: 'http://localhost:9200',
      index: 'movies',
      hits: {
        fields: ['actors', 'writers']
      },
      query: new MultiMatchQuery({ fields: ['actors', 'writers', 'title^4', 'plot'] }),
      filters: [
        new GeoShapePointFilter({
          field: 'location',
          identifier: 'location',
          label: 'Location'
        })
      ],
      facets: [
        new RefinementSelectFacet({
          field: 'type',
          identifier: 'type',
          label: 'type'
        })
      ]
    }

    it('should return correct Results', async () => {
      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit'
      })

      const gql = `
        {
          results(filters: [{ identifier: "location", geoShapePoint: {shape: {coordinates: [-74.0059728, 40.7127753], type: "point"}, relation: "intersects"}}]) {
            summary {
              appliedFilters {
                id
                identifier
                label
                display
                ... on GeoShapePointSelectedFilter {
                shape {
                    coordinates
                    type
                }
                relation
                }
              }
            }
            hits(page: {size: 10, from: 0 }) {
              items {
                id
              }
            }
            facets {
              identifier
              display
              label
            }
          }
        }
      `

      const scope = nock('http://localhost:9200')
        .post('/movies/_search')
        .reply((uri, body) => {
          expect(body).toMatchInlineSnapshot(`
            Object {
              "aggs": Object {
                "facet_bucket_all": Object {
                  "aggs": Object {
                    "type": Object {
                      "terms": Object {
                        "field": "type",
                        "size": 5,
                      },
                    },
                  },
                  "filter": Object {
                    "bool": Object {
                      "must": Array [],
                    },
                  },
                },
              },
              "from": 0,
              "query": Object {
                "bool": Object {
                  "filter": Array [
                    Object {
                        "geo_shape": Object {
                          "location": Object {
                            "relation": "intersects",
                            "shape": Object {
                              "coordinates": Array [
                                -74.0059728,
                                40.7127753,
                                ],
                                "type": "point",
                            },
                          },
                        },
                      },
                  ],
                },
              },
              "size": 10,
              "sort": Array [
                Object {
                  "_score": "desc",
                },
              ],
            }
          `)
          return [200, HitsMock]
        })

      const response = await runQuery(gql)

      expect(response.status).toEqual(200)
    })

    it('no filters applied', async () => {
      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit'
      })

      const gql = `
        {
          results(filters: []) {
            summary {
              appliedFilters {
                id
                identifier
                label
                display
                ... on GeoShapePointSelectedFilter {
                    shape {
                        coordinates
                        type
                    }
                    relation
                }
              }
            }
            hits(page: {size: 10, from: 0 }) {
              items {
                id
              }
            }
            facets {
              identifier
              display
              label
            }
          }
        }
      `

      const scope = nock('http://localhost:9200')
        .post('/movies/_search')
        .reply((uri, body) => {
          expect(body).toMatchInlineSnapshot(`
            Object {
              "aggs": Object {
                "facet_bucket_all": Object {
                  "aggs": Object {
                    "type": Object {
                      "terms": Object {
                        "field": "type",
                        "size": 5,
                      },
                    },
                  },
                  "filter": Object {
                    "bool": Object {
                      "must": Array [],
                    },
                  },
                },
              },
              "from": 0,
              "size": 10,
              "sort": Array [
                Object {
                  "_score": "desc",
                },
              ],
            }
          `)
          return [200, HitsMock]
        })

      const response = await runQuery(gql)
      expect(response.body.data).toMatchSnapshot()
      expect(response.status).toEqual(200)
    })

    it('one filter applied', async () => {
      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit'
      })

      const gql = `
        {
          results(filters: [{ identifier: "type", value: "test" }]) {
            summary {
              appliedFilters {
                id
                identifier
                label
                display
                ... on GeoShapePointSelectedFilter {
                    shape {
                        coordinates
                        type
                    }
                    relation
                }
              }
            }
            hits(page: {size: 10, from: 0 }) {
              items {
                id
              }
            }
            facets {
              identifier
              display
              label
            }
          }
        }
      `

      const scope = nock('http://localhost:9200')
        .post('/movies/_search')
        .reply((uri, body) => {
          expect(body).toMatchInlineSnapshot(`
            Object {
              "aggs": Object {
                "facet_bucket_all": Object {
                  "aggs": Object {
                    "type": Object {
                      "terms": Object {
                        "field": "type",
                        "size": 5,
                      },
                    },
                  },
                  "filter": Object {
                    "bool": Object {
                      "must": Array [
                        Object {
                          "bool": Object {
                            "must": Array [
                              Object {
                                "term": Object {
                                  "type": "test",
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              },
              "from": 0,
              "post_filter": Object {
                "bool": Object {
                  "must": Array [
                    Object {
                      "bool": Object {
                        "must": Array [
                          Object {
                            "term": Object {
                              "type": "test",
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              "size": 10,
              "sort": Array [
                Object {
                  "_score": "desc",
                },
              ],
            }
          `)
          return [200, HitsMock]
        })

      const response = await runQuery(gql)
      expect(response.body.data).toMatchSnapshot()
      expect(response.status).toEqual(200)
    })
  })
})
