# Proposed docs change: Overview

Requested ACTION: UPDATE

**Automatic UPDATE was skipped: the generated section (401 non-space chars) is much smaller than the existing one (2243) and would delete content. Review and apply this to `docs/003_build-deploy-operate/03_operate/004_logging/index.mdx` manually.**

}-%i.log.metrics.gz"
                     ignoreExceptions="false" append="true" createOnDemand="true" bufferedIO="true">
            <PatternLayout>
                <Pattern>%d{dd MMM yyyy HH:mm:ss.SSS} %-4relative [%t] %-5level %logger{35} - %m%n</Pattern>
            </PatternLayout>
            <Policies>
                <TimeBasedTriggeringPolicy/>
            </Policies>
            <DefaultRolloverStrategy max="30"/>
        </RollingFile>
```
Yes, let's make sure it's exactly correct.

Let's double check the action:
ACTION: UPDATE
SUBJECT: Overview
