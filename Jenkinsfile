// Thin Jenkinsfile — delegates everything to the shared monorepo_nx_pipeline.
// No pipeline logic lives here; the shared library owns detection, build, test,
// the production approval gate, and deploy. We only declare the service catalog.
@Library('jenkins-shared-library') _

monorepo_nx_pipeline(
    product:     'modules',
    environment: 'development',       // dev | uat | prod (resolved via environments.yaml)
    infraRepo:   'https://github.com/iar-motor-claims/modules.git',
    services: [
        'bragi' : [ kind: 'frontend', lang: 'node' ],
    ]
)
