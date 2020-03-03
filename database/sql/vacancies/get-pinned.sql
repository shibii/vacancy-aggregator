/*
  returns pinned vacancies by user id
*/
SELECT v.id,
	v.url,
	v.header,
	v.source,
	v.ts
FROM (
	SELECT vacancy_id AS id
	FROM PUBLIC.pins
	WHERE user_id = $<userId>
	) h
LEFT JOIN (
	SELECT id,
		url,
		header,
		source,
		ts
	FROM vacancies
	) v ON h.id = v.id
ORDER BY v.id DESC;