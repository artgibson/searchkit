link-packages:
	cd ./packages/searchkit-schema && yarn --force && yarn link
	cd ./packages/searchkit-elastic-ui && yarn --force && yarn link
	cd ./packages/searchkit-client && yarn --force && yarn link

	cd ./examples/next/node_modules/react && yarn link
	cd ./examples/next/node_modules/react-dom && yarn link
	cd ./examples/next/node_modules/@apollo/client && yarn link

	cd ./packages/searchkit-elastic-ui && yarn link @ag3424/client && yarn link @apollo/client && yarn link react && yarn link react-dom
	cd ./packages/searchkit-client && yarn link @apollo/client && yarn link react && yarn link react-dom
	cd ./examples/next && yarn link @ag3424/schema && yarn link @ag3424/client && yarn link @ag3424/elastic-ui
	cd ./node_modules && yarn link react && yarn link react-dom

unlink-packages:
	cd ./packages/searchkit-schema && yarn unlink && yarn --force
	cd ./packages/searchkit-elastic-ui && yarn unlink && yarn --force
	cd ./packages/searchkit-client && yarn unlink && yarn --force

	cd ./examples/next/node_modules/react && yarn unlink
	cd ./examples/next/node_modules/react-dom && yarn unlink
	cd ./examples/next/node_modules/@apollo/client && yarn unlink

	cd ./packages/searchkit-schema && yarn --force
	cd ./packages/searchkit-elastic-ui && yarn --force
	cd ./packages/searchkit-client && yarn --force

	cd ./examples/next && yarn --force
	yarn --force
