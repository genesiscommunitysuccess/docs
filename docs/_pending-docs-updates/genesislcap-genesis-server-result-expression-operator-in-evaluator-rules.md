# Proposed docs change: RESULT_EXPRESSION operator in Evaluator rules

Requested ACTION: UPDATE

**Automatic UPDATE was skipped: the generated section (366 non-space chars) is much smaller than the existing one (1840) and would delete content. Review and apply this to `docs/001_develop/02_server-capabilities/010_real-time-triggers-evaluator/index.mdx` manually.**

## Example configuration

### Scheduled events

Example `CRON_RULE` table entry:

| NAME | CRON_EXPRESSION | DESCRIPTION | TIME_ZONE | RULE_STATUS | USER_NAME | PROCESS_NAME | MESSAGE_TYPE | RESULT_EXPRESSION |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| US desk position report | `0 45 6 ? * MON-FRI *` | Send position report to US desk | America/New_York | `ENABLED`| admin | `POSITION_EVENT_HANDLER` | `EVENT_POSITION_REPORT` | `(
