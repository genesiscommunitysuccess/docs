# Proposed docs change: JMS configuration options

Requested ACTION: ADD

**Automatic UPDATE was skipped: the generated section (416 non-space chars) is much smaller than the existing one (5218) and would delete content. Review and apply this to `docs/003_build-deploy-operate/03_operate/003_update-queue/index.mdx` manually.**

SUBJECT: JMS configuration options
<<<SNIPPET>>>
## JMS

The Genesis platform enables you to use a [Jakarta Messaging](https://en.wikipedia.org/wiki/Jakarta_Messaging) (former JMS) compliant message broker as its real-time update-queue back-end via [ArtemisMQ](https://activemq.apache.org/components/artemis/).

Using a centralized external broker is highly recommended for complex, large or dynamically scaled clusters, as it reduces the complexity and overhead of peer
