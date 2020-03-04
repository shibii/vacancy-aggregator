/*
  returns all fts matches from newest to oldest
  with additional user information
*/
SELECT r.id,
	r.url,
	r.header,
	r.source,
  r.ts,
	CASE WHEN h.vacancy_id IS NOT NULL THEN true ELSE false END AS hidden,
	CASE WHEN p.vacancy_id IS NOT NULL THEN true ELSE false END AS pinned
FROM (
	SELECT *
	FROM vacancies
	WHERE tscontents @@ to_tsquery('finnish', $<terms>)
	) r
LEFT JOIN (
	SELECT hides.vacancy_id
	FROM PUBLIC.hides
	WHERE user_id = $<userId>
	) h ON r.id = h.vacancy_id
LEFT JOIN (
	SELECT pins.vacancy_id
	FROM PUBLIC.pins
	WHERE user_id = $<userId>
	) p ON r.id = p.vacancy_id
ORDER BY id DESC;