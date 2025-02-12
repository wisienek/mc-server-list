import {ViewEntity, ViewColumn} from 'typeorm';

@ViewEntity({
    name: 'server_ranking_view',
    synchronize: false,
    expression: `
SELECT
  s.id AS "serverId",
  ROW_NUMBER() OVER (
    ORDER BY COUNT(v.id) DESC, s.createdAt ASC
  ) AS ranking,
  COUNT(v.id) AS "votesCount"
FROM server s
LEFT JOIN vote v ON v.server_id = s.id
GROUP BY s.id, s.createdAt;
`,
})
export class ServerRanking {
    @ViewColumn()
    serverId: string;

    @ViewColumn()
    ranking: number;

    @ViewColumn()
    votesCount: number;
}
